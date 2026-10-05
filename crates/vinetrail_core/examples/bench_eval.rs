//! Host-only vinetrail_core latency snapshot (not CI).
use vinetrail_core::{check_soil_resistance, eval_soil, CheckSoilInput, SOIL_INPUT_FLOATS, WASM_SOIL_OFFSET};

const WARMUP: usize = 500;
const SAMPLES: usize = 10_000;

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

fn percentile(sorted: &[f64], p: f64) -> f64 {
    let idx = ((p / 100.0) * sorted.len() as f64).floor() as usize;
    sorted[idx.min(sorted.len() - 1)]
}

fn main() {
    let lanes = healthy_lanes();
    let input = CheckSoilInput {
        lanes,
        daily_notional_usd: 0.0,
    };

    for _ in 0..WARMUP {
        eval_soil(&lanes);
        check_soil_resistance(&input);
    }

    let mut eval_times = Vec::with_capacity(SAMPLES);
    for _ in 0..SAMPLES {
        let t0 = std::time::Instant::now();
        eval_soil(&lanes);
        eval_times.push(t0.elapsed().as_nanos() as f64 / 1000.0);
    }
    eval_times.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let mut check_times = Vec::with_capacity(SAMPLES);
    for _ in 0..SAMPLES {
        let t0 = std::time::Instant::now();
        check_soil_resistance(&input);
        check_times.push(t0.elapsed().as_nanos() as f64 / 1000.0);
    }
    check_times.sort_by(|a, b| a.partial_cmp(b).unwrap());

    println!("vinetrail_core bench ({} samples)", SAMPLES);
    let eval_p50 = percentile(&eval_times, 50.0);
    let eval_p99 = percentile(&eval_times, 99.0);
    let check_p50 = percentile(&check_times, 50.0);
    let check_p99 = percentile(&check_times, 99.0);
    println!(
        "eval_soil p50={:.4}µs p99={:.4}µs",
        eval_p50,
        eval_p99,
    );
    println!(
        "check_soil_resistance p50={:.4}µs p99={:.4}µs",
        check_p50,
        check_p99,
    );
}
