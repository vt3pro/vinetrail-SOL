/** Soil fast-path + auto-sever wrapper — extracted to keep risk-engine-core <200 LOC. */
import {
  MAX_SLIPPAGE,
  computeSoilSlippageMetrics,
  isTsunamiShieldWindow,
  resolveSoilMinDepthUsd,
} from "./soil-resistance-core";
import type { SoilResistanceInput, SoilResistanceResult } from "./soil-resistance-types";
import { checkSoilResistance as checkSoilResistanceBase } from "../services/risk-control-lib/soil-resistance";

/** SKU spin-off — no live sequencer / gas probes in this slice. */
const isXyzOrHip3Key = (_symbol: string): boolean => false;
const isSequencerSafe = (_refMs: number): boolean => true;
const isArbitrumStatusSequencerHealthy = (_refMs: number): boolean => true;
const isRpcRadarSequencerHealthy = (_refMs: number): boolean => true;
const isArbitrumGasGuardBlocked = (): boolean => false;
const isSoftConfirmationSafe = (_refMs: number): boolean => true;
import { hasIntentMandateFields } from "./intent-mandate";
import { applySoilTripSeverance } from "./risk-severance";
import { getGlobalMonotonicClock, resolveWallAge, saturatingSub } from "./monotonic-time";

const SOIL_CLEAR: SoilResistanceResult = { ok: true, tripped: false, crossVenueSlippage: 0, spotPerpSlippage: 0, reasons: [] };
let soilRef: SoilResistanceInput | null = null;
let soilFast = false;

export function isGatewayNominalFastPath(soil: SoilResistanceInput): boolean {
  if (soilRef === soil) return soilFast;
  if (isXyzOrHip3Key(soil.symbol)) {
    soilRef = soil; soilFast = false; return false;
  }
  if (
    computeSoilSlippageMetrics(soil, {
      maxSlippage: soil.maxSlippage ?? MAX_SLIPPAGE,
      minDepthUsd: resolveSoilMinDepthUsd(soil),
    }).tripFlags !== 0 ||
    isTsunamiShieldWindow(soil.at)
  ) {
    soilRef = soil;
    soilFast = false;
    return false;
  }
  const wallMs = soil.at?.getTime() ?? Date.now();
  const clockSample = getGlobalMonotonicClock().read(wallMs);
  if (clockSample.anomaly !== null) {
    soilRef = soil;
    soilFast = false;
    return false;
  }
  const refMs = clockSample.virtualWallMs;
  if (soil.at !== undefined) {
    const soilLeap = resolveWallAge(refMs, soil.at.getTime());
    if (soilLeap.kind === "LEAP") {
      soilRef = soil;
      soilFast = false;
      return false;
    }
    if (saturatingSub(refMs, soil.at.getTime()) > 86_400_000) {
      soilRef = soil;
      soilFast = false;
      return false;
    }
  }
  const ok =
    isSequencerSafe(refMs) &&
    isArbitrumStatusSequencerHealthy(refMs) &&
    isRpcRadarSequencerHealthy(refMs) &&
    !isArbitrumGasGuardBlocked() &&
    isSoftConfirmationSafe(refMs);
  soilRef = soil; soilFast = ok; return ok;
}

/** Mandate gate runs in `checkSoilResistanceBase` via `intent-core` when fast path is bypassed. */
export function checkSoilResistance(input: SoilResistanceInput): SoilResistanceResult {
  const result =
    !hasIntentMandateFields(input) && isGatewayNominalFastPath(input)
      ? SOIL_CLEAR
      : checkSoilResistanceBase(input);
  if (result.tripped) applySoilTripSeverance(true);
  return result;
}
