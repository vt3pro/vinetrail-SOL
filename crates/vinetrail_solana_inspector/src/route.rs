use vinetrail_core::{
    check_soil_resistance, CheckSoilInput, SOIL_INPUT_FLOATS, SoilVerdict, WASM_SOIL_OFFSET,
};

use crate::decode::SolanaTxProbe;

#[derive(Clone, Debug)]
pub struct AgentSoilHints {
    pub jupiter_depth_usd: f64,
    pub orca_depth_usd: f64,
    pub pyth_price_usd: f64,
    pub order_size_usd: f64,
    pub account_balance_usd: f64,
    pub max_slippage: f64,
    pub min_depth_usd: f64,
    pub daily_notional_usd: f64,
    pub extra_protocol_mask: f64,
}

impl Default for AgentSoilHints {
    fn default() -> Self {
        Self {
            jupiter_depth_usd: 200_000.0,
            orca_depth_usd: 200_000.0,
            pyth_price_usd: 0.0,
            order_size_usd: 0.0,
            account_balance_usd: 0.0,
            max_slippage: 0.05,
            min_depth_usd: 100_000.0,
            daily_notional_usd: 0.0,
            extra_protocol_mask: 0.0,
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct PreBroadcastVerdict {
    pub allowed: bool,
    pub soil: SoilVerdict,
    pub probe_ix_count: usize,
}

fn solana_lanes(hints: &AgentSoilHints) -> (f64, f64, f64, f64) {
    let pyth = hints.pyth_price_usd;
    let j_depth = hints.jupiter_depth_usd;
    let o_depth = hints.orca_depth_usd;
    let order = hints.order_size_usd;
    let depth = j_depth.min(o_depth);
    let j_impact = if j_depth > 0.0 && pyth > 0.0 { (order / j_depth) * pyth } else { 0.0 };
    let o_impact = if o_depth > 0.0 && pyth > 0.0 { (order / o_depth) * pyth } else { 0.0 };
    (pyth, pyth + j_impact, pyth - o_impact, depth)
}

pub fn pre_broadcast_check(probe: &SolanaTxProbe, hints: &AgentSoilHints) -> PreBroadcastVerdict {
    let mut lanes = [0.0f64; SOIL_INPUT_FLOATS];
    if probe.unknown_program {
        lanes[27] = 1.0;
    }
    lanes[27] += hints.extra_protocol_mask;
    let (spot, j_mid, o_mid, depth) = solana_lanes(hints);
    lanes[WASM_SOIL_OFFSET] = spot;
    lanes[WASM_SOIL_OFFSET + 1] = j_mid;
    lanes[WASM_SOIL_OFFSET + 2] = o_mid;
    lanes[WASM_SOIL_OFFSET + 3] = depth;
    lanes[WASM_SOIL_OFFSET + 4] = hints.order_size_usd;
    lanes[WASM_SOIL_OFFSET + 5] = hints.account_balance_usd;
    lanes[WASM_SOIL_OFFSET + 6] = hints.max_slippage;
    lanes[WASM_SOIL_OFFSET + 7] = hints.min_depth_usd;

    let soil = check_soil_resistance(&CheckSoilInput {
        lanes,
        daily_notional_usd: hints.daily_notional_usd,
    });

    PreBroadcastVerdict {
        allowed: soil.allowed,
        soil,
        probe_ix_count: probe.ix_count as usize,
    }
}
