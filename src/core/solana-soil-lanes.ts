/** Map Solana-native soil probes → internal eval lanes (Wasm ABI layout). */
import type { SoilResistanceInput } from "./soil-resistance-types";

export interface SolanaSoilLanes {
  hlSpot: number;
  hlPerp: number;
  dydxPerp: number;
  depthUsd: number;
}

/** Jupiter/Orca depth impact vs Pyth oracle — cross-venue slip without CEX perp fields. */
export function aggregateSolanaSoilLanes(input: SoilResistanceInput): SolanaSoilLanes {
  const pyth = input.pythPriceUsd;
  const jDepth = input.jupiterDepthUsd;
  const oDepth = input.orcaDepthUsd;
  const order = input.orderSizeUsd ?? 0;
  const depthUsd = Math.min(jDepth, oDepth);
  const jImpact = jDepth > 0 && pyth > 0 ? (order / jDepth) * pyth : 0;
  const oImpact = oDepth > 0 && pyth > 0 ? (order / oDepth) * pyth : 0;
  return {
    hlSpot: pyth,
    hlPerp: pyth + jImpact,
    dydxPerp: pyth - oImpact,
    depthUsd,
  };
}
