//! Soil eval — 28×f64 protocol + 8×f64 soil (TS `encodeWasmSoilInput` parity).

pub use crate::eval_flags::{cross_spread, spot_perp_spread};
pub use crate::lanes::{load_soil_scalars, load_venue_mids};

pub const PROTO_VECT_LEN: usize = 28;
pub const WASM_SOIL_OFFSET: usize = 28;
pub const EXTERNAL_PROBE_LANE: usize = 26;
pub const SOIL_INPUT_FLOATS: usize = 36;

pub const TRIP_CROSS_VENUE: u32 = 1;
pub const TRIP_DEPTH: u32 = 2;
pub const TRIP_INSUFFICIENT: u32 = 4;
pub const TRIP_PROTOCOL: u32 = 8;

pub const WASM_ABI_VERSION: u32 = 2;

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct SoilEvalResult {
    pub cross_venue: f64,
    pub spot_perp: f64,
    pub tripped: bool,
    pub soil_risk_usd: f64,
    pub capped_max_sl_usd: f64,
    pub trip_flags: u32,
}

#[inline]
fn finite_or_neg1(x: f64) -> f64 {
    if x.is_finite() { x } else { -1.0 }
}

/// Pure Rust eval — `input` is 36 f64 lanes (protocol @ 0..27, soil @ 28..35).
pub fn eval_soil(input: &[f64; SOIL_INPUT_FLOATS]) -> SoilEvalResult {
    let soil_in = WASM_SOIL_OFFSET;
    let venues = load_venue_mids(input, soil_in);
    let scalars = load_soil_scalars(input, soil_in);

    let cross = cross_spread(venues.perp_a, venues.perp_b);
    let spot_perp = spot_perp_spread(venues.spot, venues.perp_a);
    let flags = crate::eval_flags::compute_trip_flags_from_input(input, soil_in, cross);

    let slip_for_risk = if cross.is_finite() && cross >= 0.0 { cross } else { scalars.max_slip };
    let slip_unit = if slip_for_risk > 0.0 { slip_for_risk } else { 0.0 };
    let order_pos = f64_gt0(scalars.order_size);
    let soil_risk = order_pos as f64 * scalars.order_size * slip_unit;

    let dynamic_max = compute_dynamic_max_sl_usd(scalars.account);
    let max_slip_pos = f64_gt0(scalars.max_slip);
    let risk_cap = order_pos as f64 * scalars.order_size * max_slip_pos as f64 * scalars.max_slip;
    let acct_ok = (scalars.account >= 0.0) as u32;
    let capped = acct_ok as f64 * order_pos as f64 * min_f64(dynamic_max, risk_cap);

    SoilEvalResult {
        cross_venue: finite_or_neg1(cross),
        spot_perp: finite_or_neg1(spot_perp),
        tripped: flags != 0,
        soil_risk_usd: soil_risk,
        capped_max_sl_usd: capped,
        trip_flags: flags,
    }
}

#[inline]
fn f64_gt0(x: f64) -> u32 {
    (x > 0.0) as u32
}

#[inline]
fn min_f64(a: f64, b: f64) -> f64 {
    if a < b { a } else { b }
}

/// C ABI — `vinetrail_core_eval` Wasm export.
#[no_mangle]
pub unsafe extern "C" fn vinetrail_core_eval(in_ptr: *const f64, out_ptr: *mut f64) -> u32 {
    let mut input = [0.0f64; SOIL_INPUT_FLOATS];
    for i in 0..SOIL_INPUT_FLOATS {
        input[i] = *in_ptr.add(i);
    }
    let r = eval_soil(&input);
    *out_ptr.add(0) = r.cross_venue;
    *out_ptr.add(1) = r.spot_perp;
    *out_ptr.add(2) = if r.tripped { 1.0 } else { 0.0 };
    *out_ptr.add(3) = r.soil_risk_usd;
    *out_ptr.add(4) = r.capped_max_sl_usd;
    *out_ptr.add(5) = r.trip_flags as f64;
    r.trip_flags
}

#[no_mangle]
pub extern "C" fn vinetrail_core_fold_probe_mask(probe_mask: u32) -> u32 {
    probe_mask & 0xFFFF_FFF8
}

#[no_mangle]
pub extern "C" fn vinetrail_core_abi_version() -> u32 {
    WASM_ABI_VERSION
}

pub fn compute_dynamic_max_sl_usd(account_balance_usd: f64) -> f64 {
    let pos = f64_gt0(account_balance_usd);
    pos as f64 * (account_balance_usd * 0.01 + 100.0) + (1 - pos) as f64 * 100.0
}
