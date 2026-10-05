//! SliverVine M4 — soil resistance + R17/R20 circuit breakers.
#![cfg_attr(not(feature = "std"), no_std)]

mod circuit_breakers;
mod eval;
mod eval_flags;
mod lanes;
mod session;

pub use circuit_breakers::{
    eval_r17_r20, BIT_R17_DAILY_LIMIT, BIT_R20_DEADLOCK, CircuitInput, CircuitVerdict,
    SESSION_NOTIONAL_CAP_USD,
};
pub use eval::{
    compute_dynamic_max_sl_usd, eval_soil, SoilEvalResult, SOIL_INPUT_FLOATS, TRIP_CROSS_VENUE,
    TRIP_DEPTH, TRIP_INSUFFICIENT, TRIP_PROTOCOL, WASM_ABI_VERSION, WASM_SOIL_OFFSET,
};

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct SoilVerdict {
    pub soil: SoilEvalResult,
    pub circuit: CircuitVerdict,
    pub allowed: bool,
}

#[derive(Clone, Copy, Debug)]
pub struct CheckSoilInput {
    pub lanes: [f64; SOIL_INPUT_FLOATS],
    pub daily_notional_usd: f64,
}

#[inline]
pub fn check_soil_resistance(input: &CheckSoilInput) -> SoilVerdict {
    let soil = eval_soil(&input.lanes);
    let order_size = input.lanes[eval::WASM_SOIL_OFFSET + 4];
    let circuit = eval_r17_r20(CircuitInput {
        order_size_usd: order_size,
        daily_notional_usd: input.daily_notional_usd,
        soil_trip_flags: soil.trip_flags,
    });
    let soil_ok = (soil.trip_flags == 0) as u32;
    let r20_clear = (!circuit.r20_tripped) as u32;
    let allowed = soil_ok == 1 && r20_clear == 1;
    SoilVerdict {
        soil,
        circuit,
        allowed,
    }
}

#[cfg(all(not(feature = "std"), not(test)))]
#[panic_handler]
fn panic(_: &core::panic::PanicInfo) -> ! {
    loop {}
}
