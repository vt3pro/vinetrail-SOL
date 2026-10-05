import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as sdk from "../../src/sdk";
import { guardAgentPreSign } from "../../src/sdk";
import { readStateOverride, severSigningChannel, writeStateOverride } from "../../src/core/state-store";
import { SAFE_TRADING_TIME } from "../helpers/system-time";

const SDK_ALLOWLIST = new Set([
  "AGENT_INTENT_CHAIN_TAG",
  "EIP712_DOMAIN_NAME",
  "EIP712_DOMAIN_VERSION",
  "GATE_EIP712_DOMAIN_EXOMESH_WIRE",
  "GATE_EIP712_DOMAIN_WIRE",
  "SESSION_KEY_NOTIONAL_CAP_USD",
  "VinetrailGuard",
  "VinetrailPreSignGate",
  "checkSoilResistance",
  "evaluateAgentExoMeshGuard",
  "guardAgentPreSign",
  "guardJitoBundlePreBroadcast",
  "guardSolanaPreBroadcast",
  "wrapJitoBundleSend",
  "wrapSolanaSendTransaction",
  "resolveGateEip712DomainName",
]);

const __dirname = dirname(fileURLToPath(import.meta.url));
const SDK_BARREL = join(__dirname, "../../src/sdk.ts");

afterEach(() => {
  writeStateOverride(null);
  vi.restoreAllMocks();
});

describe("sdk export surface", () => {
  it("barrel exports only the Vinetrail-Solana allowlist", () => {
    const keys = Object.keys(sdk).sort();
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      expect(SDK_ALLOWLIST.has(key)).toBe(true);
    }
    expect(keys).toEqual([...SDK_ALLOWLIST].sort());
  });

  it("barrel source omits secret-bearing identifiers", () => {
    const source = readFileSync(SDK_BARREL, "utf8");
    expect(source).not.toMatch(/privateKey|mnemonic|SECRET_KEY|EXOMESH_SESSION_KEY_STUB/i);
  });

  it("EXOMESH_SESSION_KEY_STUB is not a public barrel export", () => {
    expect("EXOMESH_SESSION_KEY_STUB" in sdk).toBe(false);
  });

  it("guardAgentPreSign reject stays offline (no fetch)", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("fetch should not run"));

    const result = await guardAgentPreSign({
      intent: {
        maxSlippageBps: 5,
        soilResistanceThreshold: 5,
        targetMarket: "SOL",
      },
      soil: {
        symbol: "SOL",
        pythPriceUsd: 100,
        jupiterDepthUsd: 1_000,
        orcaDepthUsd: 1_000,
        orderSizeUsd: 500,
        at: SAFE_TRADING_TIME,
      },
      atMs: SAFE_TRADING_TIME.getTime(),
    });

    expect(result.allowed).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("writeStateOverride(null) clears severance latch for test hygiene", () => {
    severSigningChannel();
    expect(readStateOverride()?.signingChannelOpen).toBe(false);
    writeStateOverride(null);
    expect(readStateOverride()).toBeNull();
  });
});
