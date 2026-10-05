import { describe, expect, it } from "vitest";
import {
  AGENT_DEADMAN_SLIPPAGE_BPS,
  EXOMESH_SLIPPAGE_EXCEEDED,
  DEADMAN_SWITCH_TRIPPED,
  evaluateAgentExoMeshGuard,
  guardAgentPreSign,
} from "../../src/core/agent-exomesh-guard";
import { HEALTHY_SOLANA_SOIL } from "../helpers/solana-soil-fixtures";
import { SAFE_TRADING_TIME } from "../helpers/system-time";

describe("agent-exomesh-guard Deadman Switch", () => {
  it("allows clear soil within deadman bps", () => {
    const v = evaluateAgentExoMeshGuard({
      intent: {
        maxSlippageBps: AGENT_DEADMAN_SLIPPAGE_BPS,
        soilResistanceThreshold: AGENT_DEADMAN_SLIPPAGE_BPS,
        targetMarket: "SOL-PERP",
      },
      soil: HEALTHY_SOLANA_SOIL,
      atMs: SAFE_TRADING_TIME.getTime(),
    });
    expect(v.allowed).toBe(true);
    expect(v.rejectPayload).toBeUndefined();
  });

  it("trips deadman on cross-venue slippage breach", () => {
    const v = evaluateAgentExoMeshGuard({
      intent: {
        maxSlippageBps: 10,
        soilResistanceThreshold: 10,
        targetMarket: "SOL-PERP",
      },
      soil: {
        ...HEALTHY_SOLANA_SOIL,
        pythPriceUsd: 150,
        jupiterDepthUsd: 50_000,
        orcaDepthUsd: 50_000,
        orderSizeUsd: 5_000,
      },
      atMs: SAFE_TRADING_TIME.getTime(),
    });
    expect(v.allowed).toBe(false);
    expect(v.rejectPayload?.deadmanTriggered).toBe(true);
    expect(v.rejectPayload?.code).toBe(EXOMESH_SLIPPAGE_EXCEEDED);
  });

  it("guardAgentPreSign returns signed reject stub when tripped", async () => {
    const result = await guardAgentPreSign({
      intent: {
        maxSlippageBps: 5,
        soilResistanceThreshold: 5,
        targetMarket: "SOL-PERP",
      },
      soil: {
        ...HEALTHY_SOLANA_SOIL,
        pythPriceUsd: 100,
        jupiterDepthUsd: 1_000,
        orcaDepthUsd: 1_000,
        orderSizeUsd: 500,
      },
      atMs: SAFE_TRADING_TIME.getTime(),
    });
    expect(result.allowed).toBe(false);
    expect(result.reject?.signatureStub).toMatch(/^0x[0-9a-f]+$/i);
    expect(result.reject?.payload.code).toBe(EXOMESH_SLIPPAGE_EXCEEDED);
    expect(result.reject?.payload.deadmanTriggered).toBe(true);
    expect(DEADMAN_SWITCH_TRIPPED).toBe("DEADMAN_SWITCH_TRIPPED");
  });
});
