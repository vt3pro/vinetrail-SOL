import { afterEach, describe, expect, it } from "vitest";
import { checkSoilResistance } from "../../src/core/risk-engine-soil";
import { readStateOverride, writeStateOverride } from "../../src/core/state-store";
import { VENUE_DRIFT_REJECTED } from "../../src/core/intent-mandate";
import { AGENT_INTENT_CHAIN_TAG } from "../../src/sdk/constants";
import { HEALTHY_SOLANA_SOIL } from "../helpers/solana-soil-fixtures";
import { SAFE_TRADING_TIME } from "../helpers/system-time";

const ALLOWED = ["jupiter", "orca", "sanctuary_vault"] as const;
const TOXIC = "unauthorized_program";
const T0 = SAFE_TRADING_TIME;

afterEach(() => {
  writeStateOverride(null);
});

describe("venue drift mandate", () => {
  it("rejects unauthorized program venue and severs signing channel", () => {
    const verdict = checkSoilResistance({
      chainId: AGENT_INTENT_CHAIN_TAG,
      symbol: "SOL",
      allowedVenues: [...ALLOWED],
      targetVenue: TOXIC,
      pythPriceUsd: 1,
      jupiterDepthUsd: 200_000,
      orcaDepthUsd: 200_000,
      at: T0,
    });
    expect(verdict.tripped).toBe(true);
    expect(verdict.reasons.some((r) => r.includes(VENUE_DRIFT_REJECTED))).toBe(true);
    expect(readStateOverride()?.signingChannelOpen).toBe(false);
  });

  it("allows jupiter when whitelisted", () => {
    const verdict = checkSoilResistance({
      ...HEALTHY_SOLANA_SOIL,
      chainId: AGENT_INTENT_CHAIN_TAG,
      allowedVenues: [...ALLOWED],
      venueKey: "jupiter",
      at: T0,
    });
    expect(verdict.tripped).toBe(false);
    expect(verdict.ok).toBe(true);
  });

  it("trips on toxic venueKey without explicit targetVenue", () => {
    const verdict = checkSoilResistance({
      chainId: AGENT_INTENT_CHAIN_TAG,
      symbol: "MEME",
      allowedVenues: [...ALLOWED],
      venueKey: TOXIC,
      pythPriceUsd: 1,
      jupiterDepthUsd: 200_000,
      orcaDepthUsd: 200_000,
      at: T0,
    });
    expect(verdict.tripped).toBe(true);
    expect(verdict.reasons.some((r) => r.includes(VENUE_DRIFT_REJECTED))).toBe(true);
  });
});
