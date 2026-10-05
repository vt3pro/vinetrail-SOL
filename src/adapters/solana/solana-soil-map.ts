/** Map Solana structural probe + agent hints → `SoilResistanceInput`. */
import type { SoilResistanceInput } from "../../core/soil-resistance-types";
import type { SolanaTxProbe } from "./solana-tx-probe";

export interface SolanaSoilMapInput {
  probe: SolanaTxProbe;
  soil: SoilResistanceInput;
  /** Lane-27 protocol mask parity with Rust inspector (unknown program → 1). */
  protocolMask?: number;
}

export function mapSolanaProbeToSoil(input: SolanaSoilMapInput): SoilResistanceInput {
  const symbol = input.soil.symbol || "SOL";
  const venueKey = input.soil.venueKey ?? input.soil.targetVenue ?? "solana_mainnet";
  if (input.probe.unknownProgram || (input.protocolMask ?? 0) > 0) {
    return {
      ...input.soil,
      symbol,
      venueKey,
      targetVenue: venueKey,
      jupiterDepthUsd: 0,
      orcaDepthUsd: 0,
      orderSizeUsd: input.soil.orderSizeUsd,
      accountBalanceUsd: input.soil.accountBalanceUsd,
    };
  }
  return {
    ...input.soil,
    symbol,
    venueKey,
    targetVenue: venueKey,
    orderSizeUsd: input.soil.orderSizeUsd,
    accountBalanceUsd: input.soil.accountBalanceUsd,
  };
}
