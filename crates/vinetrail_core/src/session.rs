//! Session clip/TTL + async vault drift (Wasm C ABI parity).

#[no_mangle]
pub extern "C" fn session_core_ok(
    max_order_clip: f64,
    clip_limit: f64,
    expires_at_ms: f64,
    now_ms: f64,
    auto_expire_window_ms: f64,
) -> i32 {
    if !(max_order_clip > 0.0) || max_order_clip > clip_limit {
        return 0;
    }
    if !(expires_at_ms > now_ms) {
        return 0;
    }
    let remaining = expires_at_ms - now_ms;
    if remaining > auto_expire_window_ms {
        return 0;
    }
    1
}

#[no_mangle]
pub extern "C" fn eval_async_vault_drift(request_rate: u64, claim_rate: u64, max_bps: u64) -> u32 {
    if request_rate == 0 {
        return 1;
    }
    let delta = if claim_rate > request_rate {
        claim_rate - request_rate
    } else {
        request_rate - claim_rate
    };
    if (delta as u128) * 10000 > (max_bps as u128) * (request_rate as u128) {
        1
    } else {
        0
    }
}
