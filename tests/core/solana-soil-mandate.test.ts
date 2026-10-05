import { describe, expect, it } from "vitest";
import { checkSoilResistance } from "../../src/core/risk-engine-soil";
import { readStateOverride } from "../../src/core/state-store";
import { AGENT_INTENT_CHAIN_TAG } from "../../src/sdk/constants";
import { SAFE_TRADING_TIME } from "../helpers/system-time";

describe("solana soil mandate", () => {
  it("trips cross-venue slippage on agent cluster tag and severs signing channel", () => {
    const verdict = checkSoilResistance({
      symbol: "MEME",
      chainId: AGENT_INTENT_CHAIN_TAG,
      agentId: "agent-sim",
      pythPriceUsd: 1.0,
      jupiterDepthUsd: 50_000,
      orcaDepthUsd: 50_000,
      orderSizeUsd: 1000,
      maxSlippage: 0.01,
      at: SAFE_TRADING_TIME,
    });
    expect(verdict.tripped).toBe(true);
    expect(verdict.reasons.length).toBeGreaterThan(0);
    expect(readStateOverride()?.signingChannelOpen).toBe(false);
  });
});
