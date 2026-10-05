/** SKU cold-path soil gate — pure core, no external RPC probes. */
import { evaluateIntentMandateGate } from "../../core/intent-mandate";
import {
  MAX_SLIPPAGE,
  computeSoilSlippageMetrics,
  resolveSoilMinDepthUsd,
} from "../../core/soil-resistance-core";
import {
  SOIL_REASON_CROSS_VENUE,
  SOIL_REASON_DEPTH_USD,
  SOIL_REASON_INSUFFICIENT_DEPTH,
} from "../../core/soil-slippage-cold-path";
import type { SoilResistanceInput, SoilResistanceResult } from "../../core/soil-resistance-types";

function tripReasons(flags: number): string[] {
  const reasons: string[] = [];
  if (flags & SOIL_REASON_INSUFFICIENT_DEPTH) reasons.push("SOIL_INSUFFICIENT_DEPTH");
  if (flags & SOIL_REASON_CROSS_VENUE) reasons.push("SOIL_CROSS_VENUE_SLIPPAGE");
  if (flags & SOIL_REASON_DEPTH_USD) reasons.push("SOIL_DEPTH_USD");
  return reasons;
}

export function checkSoilResistance(input: SoilResistanceInput): SoilResistanceResult {
  const mandate = evaluateIntentMandateGate(input);
  if (mandate) return mandate;

  const metrics = computeSoilSlippageMetrics(input, {
    maxSlippage: input.maxSlippage ?? MAX_SLIPPAGE,
    minDepthUsd: resolveSoilMinDepthUsd(input),
  });

  if (metrics.tripFlags === 0) {
    return {
      ok: true,
      tripped: false,
      crossVenueSlippage: metrics.crossVenueSlippage,
      spotPerpSlippage: metrics.spotPerpSlippage,
      reasons: [],
    };
  }

  return {
    ok: false,
    tripped: true,
    crossVenueSlippage: metrics.crossVenueSlippage,
    spotPerpSlippage: metrics.spotPerpSlippage,
    reasons: tripReasons(metrics.tripFlags),
  };
}
