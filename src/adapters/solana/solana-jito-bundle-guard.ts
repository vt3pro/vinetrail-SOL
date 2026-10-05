/** Jito bundle-path guard — sequential VersionedTransaction pre-broadcast (no Jito wire decode). */
import type { VersionedTransaction } from "@solana/web3.js";
import { RiskLimitExceeded } from "../../core/errors";
import {
  guardSolanaPreBroadcast,
  type SolanaAgentGuardInput,
  type SolanaAgentGuardResult,
} from "../solanaAgentAdapter";

export interface JitoBundleGuardInput extends Omit<SolanaAgentGuardInput, "transaction"> {
  transactions: readonly VersionedTransaction[];
}

export interface JitoBundleGuardResult {
  allowed: boolean;
  failedIndex: number | null;
  results: SolanaAgentGuardResult[];
  reasons: string[];
}

export function guardJitoBundlePreBroadcast(input: JitoBundleGuardInput): JitoBundleGuardResult {
  const txs = input.transactions;
  const n = txs.length;
  const results: SolanaAgentGuardResult[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const verdict = guardSolanaPreBroadcast({ ...input, transaction: txs[i] });
    results[i] = verdict;
    if (!verdict.allowed) {
      return {
        allowed: false,
        failedIndex: i,
        results,
        reasons: verdict.reasons.length > 0 ? [...verdict.reasons] : ["SOLANA_PRE_BROADCAST_BLOCKED"],
      };
    }
  }
  return { allowed: true, failedIndex: null, results, reasons: [] };
}

export function wrapJitoBundleSend<T>(
  sendFn: (transactions: readonly VersionedTransaction[]) => Promise<T>,
  guardInput: Omit<JitoBundleGuardInput, "transactions">,
): (transactions: readonly VersionedTransaction[]) => Promise<T> {
  return async (transactions: readonly VersionedTransaction[]) => {
    const verdict = guardJitoBundlePreBroadcast({ ...guardInput, transactions });
    if (!verdict.allowed) {
      const idx = verdict.failedIndex ?? 0;
      throw new RiskLimitExceeded("SOLANA_BUNDLE_PRE_BROADCAST_BLOCKED", {
        level: "error",
        module: "risk-control",
        event: "ROOT_PROTECTION_TRIP",
        symbol: guardInput.soil.symbol,
        timestamp: new Date().toISOString(),
        message: verdict.reasons.join(";") || "SOLANA_BUNDLE_PRE_BROADCAST_BLOCKED",
        details: {
          reasons: verdict.reasons,
          failedIndex: idx,
          jito: guardInput.jito?.endpoint ?? null,
        },
      });
    }
    return sendFn(transactions);
  };
}
