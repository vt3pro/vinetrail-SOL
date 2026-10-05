//! Spread / depth thresholds aligned with `sanctuary_invariants::soil_eval_u64`.

const MIN_DEPTH_USD: f64 = 100_000.0;
const MAX_SPREAD_BPS_PROXY: f64 = 0.005;

use vinetrail_core::{eval_soil, SOIL_INPUT_FLOATS, WASM_SOIL_OFFSET};

fn lanes_with(depth: f64, hl_perp: f64, dydx: f64, max_slip: f64) -> [f64; SOIL_INPUT_FLOATS] {
    let mut lanes = [0.0f64; SOIL_INPUT_FLOATS];
    lanes[WASM_SOIL_OFFSET] = hl_perp;
    lanes[WASM_SOIL_OFFSET + 1] = hl_perp;
    lanes[WASM_SOIL_OFFSET + 2] = dydx;
    lanes[WASM_SOIL_OFFSET + 3] = depth;
    lanes[WASM_SOIL_OFFSET + 6] = max_slip;
    lanes[WASM_SOIL_OFFSET + 7] = MIN_DEPTH_USD;
    lanes
}

#[test]
fn sanctuary_depth_floor() {
    let r = eval_soil(&lanes_with(99_999.0, 100.0, 100.0, 0.1));
    assert!(r.tripped);
}

#[test]
fn spread_within_cap_passes() {
    let r = eval_soil(&lanes_with(500_000.0, 100.0, 100.0 + MAX_SPREAD_BPS_PROXY, 0.01));
    assert!(!r.tripped);
}
