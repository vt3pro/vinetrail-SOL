use vinetrail_core::{
    check_soil_resistance, compute_dynamic_max_sl_usd, eval_soil, CheckSoilInput, SOIL_INPUT_FLOATS,
    TRIP_CROSS_VENUE, TRIP_DEPTH, TRIP_PROTOCOL, WASM_SOIL_OFFSET,
};

fn healthy_lanes() -> [f64; SOIL_INPUT_FLOATS] {
    let mut lanes = [0.0f64; SOIL_INPUT_FLOATS];
    lanes[WASM_SOIL_OFFSET] = 3500.0;
    lanes[WASM_SOIL_OFFSET + 1] = 3500.0;
    lanes[WASM_SOIL_OFFSET + 2] = 3500.0;
    lanes[WASM_SOIL_OFFSET + 3] = 500_000.0;
    lanes[WASM_SOIL_OFFSET + 4] = 1_000.0;
    lanes[WASM_SOIL_OFFSET + 5] = 10_000.0;
    lanes[WASM_SOIL_OFFSET + 6] = 0.05;
    lanes[WASM_SOIL_OFFSET + 7] = 100_000.0;
    lanes
}

#[test]
fn healthy_soil_passes() {
    let r = eval_soil(&healthy_lanes());
    assert!(!r.tripped);
    assert_eq!(r.trip_flags, 0);
}

#[test]
fn cross_venue_trips() {
    let mut lanes = healthy_lanes();
    lanes[WASM_SOIL_OFFSET + 2] = 4000.0;
    lanes[WASM_SOIL_OFFSET + 6] = 0.001;
    let r = eval_soil(&lanes);
    assert!(r.tripped);
    assert_ne!(r.trip_flags & TRIP_CROSS_VENUE, 0);
}

#[test]
fn depth_trips() {
    let mut lanes = healthy_lanes();
    lanes[WASM_SOIL_OFFSET + 3] = 50_000.0;
    let r = eval_soil(&lanes);
    assert!(r.tripped);
    assert_ne!(r.trip_flags & TRIP_DEPTH, 0);
}

#[test]
fn protocol_mask_trips() {
    let mut lanes = healthy_lanes();
    lanes[27] = 1.0;
    let r = eval_soil(&lanes);
    assert!(r.tripped);
    assert_ne!(r.trip_flags & TRIP_PROTOCOL, 0);
}

#[test]
fn dynamic_max_sl_golden() {
    assert_eq!(compute_dynamic_max_sl_usd(10_000.0), 200.0);
    assert_eq!(compute_dynamic_max_sl_usd(0.0), 100.0);
}

#[test]
fn r17_blocks_large_order() {
    let lanes = healthy_lanes();
    let mut lanes = lanes;
    lanes[WASM_SOIL_OFFSET + 4] = 6_000.0;
    let v = check_soil_resistance(&CheckSoilInput {
        lanes,
        daily_notional_usd: 0.0,
    });
    assert!(!v.allowed);
    assert!(v.circuit.r17_tripped);
    assert!(v.circuit.r20_tripped);
}
