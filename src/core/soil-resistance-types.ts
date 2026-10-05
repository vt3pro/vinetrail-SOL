/** Soil resistance input/output types — pure core SSOT. */

export interface SoilResistanceInput {
  symbol: string;
  /** Pyth (or equivalent) oracle mid for the agent market. */
  pythPriceUsd: number;
  /** Jupiter route book depth (USD) at quote time. */
  jupiterDepthUsd: number;
  /** Orca pool depth (USD) at quote time. */
  orcaDepthUsd: number;
  /** Approved venue key — must match `allowedVenues` when mandate is armed. */
  venueKey?: string;
  /** Alias for `venueKey` — agent-declared execution target. */
  targetVenue?: string;
  /** Session-key venue whitelist — unauthorized switch → `VENUE_DRIFT_REJECTED`. */
  allowedVenues?: readonly string[];
  /** EIP-712 intent digest — bound to `chainId` + venue + `intentAction`. */
  intentDigest?: string;
  intentAction?: string;
  chainId?: number;
  /** Per-agent attempt budget key when digest absent. */
  agentId?: string;
  maxSlippage?: number;
  orderSizeUsd?: number;
  accountBalanceUsd?: number;
  minDepthUsd?: number;
  isTestnet?: boolean;
  at?: Date;
  requestedLeverage?: number;
  disableThresholdJitter?: boolean;
}

export interface SoilResistanceResult {
  ok: boolean;
  tripped: boolean;
  crossVenueSlippage: number;
  spotPerpSlippage: number;
  reasons: string[];
  soilRiskUsd?: number;
  cappedMaxSlUsd?: number;
}
