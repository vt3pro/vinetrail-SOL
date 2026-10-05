/** Solana pre-broadcast agent risk middleware — RPC / Jito intercept. */
import { VersionedTransaction } from "@solana/web3.js";
import { RiskLimitExceeded } from "../core/errors";
import { evaluateGatewayRules } from "../core/risk-engine-gateway-rules";
import { applySoilTripSeverance } from "../core/risk-severance";
import { vineWrapProtection } from "../core/root-protection-core";
import type { SoilResistanceInput } from "../core/soil-resistance-types";
import { SESSION_KEY_NOTIONAL_CAP_USD } from "../sdk/constants";
import { mapSolanaProbeToSoil } from "./solana/solana-soil-map";
import { probeVersionedTransaction, type SolanaTxProbe } from "./solana/solana-tx-probe";

export interface SolanaJitoHook {
  endpoint?: string;
}

export interface SolanaAgentGuardInput {
  transaction: VersionedTransaction;
  soil: SoilResistanceInput;
  symbol?: string;
  dailyNotionalUsd?: number;
  estimatedLossUsd?: number;
  accountBalanceUsd?: number;
  criHardlock?: boolean;
  jito?: SolanaJitoHook;
}

export interface SolanaAgentGuardResult {
  allowed: boolean;
  probe: SolanaTxProbe | null;
  gateway: ReturnType<typeof evaluateGatewayRules>;
  reasons: string[];
}

function r17Trip(orderSizeUsd: number | undefined, dailyNotionalUsd: number): string[] {
  const order = orderSizeUsd ?? 0;
  const daily = dailyNotionalUsd > 0 ? dailyNotionalUsd : 0;
  if (order > SESSION_KEY_NOTIONAL_CAP_USD || daily + order > SESSION_KEY_NOTIONAL_CAP_USD) {
    return ["R17_DAILY_LIMIT"];
  }
  return [];
}

export function guardSolanaPreBroadcast(input: SolanaAgentGuardInput): SolanaAgentGuardResult {
  const probe = probeVersionedTransaction(input.transaction);
  if (!probe) {
    const gateway = evaluateGatewayRules({
      symbol: input.symbol ?? input.soil.symbol,
      soil: input.soil,
      payloadPoison: true,
    });
    applySoilTripSeverance(true);
    return { allowed: false, probe: null, gateway, reasons: ["SOLANA_EMPTY_INSTRUCTIONS"] };
  }

  const r17 = r17Trip(input.soil.orderSizeUsd, input.dailyNotionalUsd ?? 0);
  if (r17.length > 0) {
    applySoilTripSeverance(true);
    return {
      allowed: false,
      probe,
      gateway: {
        blocked: true,
        tripped: true,
        crashed: false,
        failClosed: true,
        reasons: r17,
      },
      reasons: r17,
    };
  }

  const soil = mapSolanaProbeToSoil({
    probe,
    soil: input.soil,
    protocolMask: probe.unknownProgram ? 1 : 0,
  });
  const symbol = input.symbol ?? soil.symbol;
  const gateway = evaluateGatewayRules({
    symbol,
    soil,
    estimatedLossUsd: input.estimatedLossUsd,
    accountBalanceUsd: input.accountBalanceUsd,
    criHardlock: input.criHardlock,
  });

  if (gateway.tripped) {
    applySoilTripSeverance(true);
  } else if (
    input.estimatedLossUsd !== undefined &&
    input.accountBalanceUsd !== undefined
  ) {
    try {
      vineWrapProtection({
        symbol,
        estimatedLossUsd: input.estimatedLossUsd,
        accountBalanceUsd: input.accountBalanceUsd,
        criHardlock: input.criHardlock,
      });
    } catch (err) {
      if (err instanceof RiskLimitExceeded) {
        applySoilTripSeverance(true);
        return {
          allowed: false,
          probe,
          gateway: {
            blocked: true,
            tripped: true,
            crashed: false,
            failClosed: true,
            reasons: [err.code],
            errorCode: err.code,
          },
          reasons: [err.code],
        };
      }
      throw err;
    }
  }

  const allowed = !gateway.blocked && !gateway.tripped;
  return {
    allowed,
    probe,
    gateway,
    reasons: gateway.reasons.length > 0 ? [...gateway.reasons] : [],
  };
}

export function wrapSolanaSendTransaction<T>(
  sendFn: (tx: VersionedTransaction) => Promise<T>,
  guardInput: Omit<SolanaAgentGuardInput, "transaction">,
): (tx: VersionedTransaction) => Promise<T> {
  return async (tx: VersionedTransaction) => {
    const verdict = guardSolanaPreBroadcast({ ...guardInput, transaction: tx });
    if (!verdict.allowed) {
      throw new RiskLimitExceeded("SOLANA_PRE_BROADCAST_BLOCKED", {
        level: "error",
        module: "risk-control",
        event: "ROOT_PROTECTION_TRIP",
        symbol: guardInput.soil.symbol,
        timestamp: new Date().toISOString(),
        message: verdict.reasons.join(";") || "SOLANA_PRE_BROADCAST_BLOCKED",
        details: { reasons: verdict.reasons, jito: guardInput.jito?.endpoint ?? null },
      });
    }
    return sendFn(tx);
  };
}
