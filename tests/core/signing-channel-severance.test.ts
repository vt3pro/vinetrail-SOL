import { afterEach, describe, expect, it } from "vitest";
import { checkSoilResistance } from "../../src/core/risk-engine-soil";
import { readStateOverride, writeStateOverride } from "../../src/core/state-store";
import { AGENT_INTENT_CHAIN_TAG } from "../../src/sdk/constants";
import { HEALTHY_SOLANA_SOIL } from "../helpers/solana-soil-fixtures";
import { SAFE_TRADING_TIME } from "../helpers/system-time";

const ALLOWED = ["jupiter", "orca", "sanctuary_vault"] as const;

afterEach(() => {
  writeStateOverride(null);
});

describe("signing channel severance", () => {
  it("soil slippage trip severs signing channel", () => {
    const verdict = checkSoilResistance({
      symbol: "SOL-PERP",
      pythPriceUsd: 100,
      jupiterDepthUsd: 1_000,
      orcaDepthUsd: 1_000,
      orderSizeUsd: 500,
      maxSlippage: 0.01,
      at: SAFE_TRADING_TIME,
    });
    expect(verdict.tripped).toBe(true);
    expect(readStateOverride()?.signingChannelOpen).toBe(false);
  });

  it("mandate venue drift severs signing channel", () => {
    const verdict = checkSoilResistance({
      chainId: AGENT_INTENT_CHAIN_TAG,
      symbol: "SOL",
      allowedVenues: [...ALLOWED],
      targetVenue: "unauthorized_program",
      pythPriceUsd: 1,
      jupiterDepthUsd: 200_000,
      orcaDepthUsd: 200_000,
      at: SAFE_TRADING_TIME,
    });
    expect(verdict.tripped).toBe(true);
    expect(readStateOverride()?.signingChannelOpen).toBe(false);
  });

  it("healthy Solana soil keeps signing channel open", () => {
    const verdict = checkSoilResistance(HEALTHY_SOLANA_SOIL);
    expect(verdict.tripped).toBe(false);
    expect(readStateOverride()?.signingChannelOpen).not.toBe(false);
  });
});
