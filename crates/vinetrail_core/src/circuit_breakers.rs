//! R17 / R20 defense roots — parity with `DefenseMatrixBitmap` + TS severance.

/// R17 — daily / session notional cap (TS `SESSION_KEY_NOTIONAL_CAP_USD`).
pub const SESSION_NOTIONAL_CAP_USD: f64 = 5_000.0;
/// Defense matrix bit index R17 (1 << 16).
pub const BIT_R17_DAILY_LIMIT: u32 = 1 << 16;
/// Defense matrix bit index R20 (1 << 19).
pub const BIT_R20_DEADLOCK: u32 = 1 << 19;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct CircuitVerdict {
    pub defense_bits: u32,
    pub r17_tripped: bool,
    pub r20_tripped: bool,
}

#[derive(Clone, Copy, Debug)]
pub struct CircuitInput {
    pub order_size_usd: f64,
    pub daily_notional_usd: f64,
    pub soil_trip_flags: u32,
}

#[inline]
fn f64_gt(a: f64, b: f64) -> u32 {
    (a > b) as u32
}

#[inline]
fn clamp_nonneg(x: f64) -> f64 {
    if x > 0.0 { x } else { 0.0 }
}

pub fn eval_r17_r20(input: CircuitInput) -> CircuitVerdict {
    let order = clamp_nonneg(input.order_size_usd);
    let daily = clamp_nonneg(input.daily_notional_usd);
    let projected = daily + order;

    let r17 = f64_gt(order, SESSION_NOTIONAL_CAP_USD) | f64_gt(projected, SESSION_NOTIONAL_CAP_USD);
    let soil_trip = (input.soil_trip_flags != 0) as u32;
    let r20 = soil_trip | r17;

    let bits = r17 * BIT_R17_DAILY_LIMIT | r20 * BIT_R20_DEADLOCK;

    CircuitVerdict {
        defense_bits: bits,
        r17_tripped: r17 == 1,
        r20_tripped: r20 == 1,
    }
}
