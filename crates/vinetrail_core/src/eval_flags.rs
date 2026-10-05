//! Branchless trip-flag aggregation (portable bitmask batch).

use crate::eval::{EXTERNAL_PROBE_LANE, PROTO_VECT_LEN, TRIP_CROSS_VENUE, TRIP_DEPTH, TRIP_INSUFFICIENT, TRIP_PROTOCOL};
use crate::lanes::{SoilScalars, VenueMids};

#[inline]
fn abs_f64(x: f64) -> f64 {
    f64::from_bits(x.to_bits() & !(1u64 << 63))
}

#[inline]
fn f64_gt(a: f64, b: f64) -> u32 {
    (a > b) as u32
}

#[inline]
pub fn cross_spread(hl_perp: f64, dydx_perp: f64) -> f64 {
    let both = f64_gt(hl_perp, 0.0) & f64_gt(dydx_perp, 0.0);
    let raw = abs_f64(dydx_perp - hl_perp) / hl_perp;
    if both == 1 && raw.is_finite() {
        raw
    } else {
        f64::INFINITY
    }
}

#[inline]
pub fn spot_perp_spread(hl_spot: f64, hl_perp: f64) -> f64 {
    let ok = f64_gt(hl_spot, 0.0);
    let raw = abs_f64(hl_perp - hl_spot) / hl_spot;
    if ok == 1 && raw.is_finite() {
        raw
    } else {
        f64::INFINITY
    }
}

pub fn compute_trip_flags(
    venues: VenueMids,
    scalars: SoilScalars,
    cross: f64,
    probe_lane: f64,
    protocol_lane: f64,
) -> u32 {
    let hl_perp = venues.perp_a;
    let dydx_perp = venues.perp_b;
    let max_slip = scalars.max_slip;
    let depth_usd = scalars.depth_usd;
    let min_depth = scalars.min_depth;

    let insuf = (f64_gt(0.0, hl_perp) | f64_gt(0.0, dydx_perp)) * TRIP_INSUFFICIENT;
    let mids_ok = f64_gt(hl_perp, 0.0) * f64_gt(dydx_perp, 0.0);
    let cross_trip = mids_ok * f64_gt(cross, max_slip) * TRIP_CROSS_VENUE;
    let depth_ge0 = if depth_usd >= 0.0 { 1u32 } else { 0u32 };
    let depth_trip = depth_ge0 * f64_gt(min_depth, depth_usd) * TRIP_DEPTH;

    let probe = (probe_lane != 0.0) as u32 * (probe_lane as u32);
    let proto = (protocol_lane != 0.0) as u32 * TRIP_PROTOCOL;

    insuf | cross_trip | depth_trip | probe | proto
}

pub fn compute_trip_flags_from_input(input: &[f64; crate::eval::SOIL_INPUT_FLOATS], soil_in: usize, cross: f64) -> u32 {
    let venues = crate::lanes::load_venue_mids(input, soil_in);
    let scalars = crate::lanes::load_soil_scalars(input, soil_in);
    compute_trip_flags(
        venues,
        scalars,
        cross,
        input[EXTERNAL_PROBE_LANE],
        input[PROTO_VECT_LEN - 1],
    )
}
