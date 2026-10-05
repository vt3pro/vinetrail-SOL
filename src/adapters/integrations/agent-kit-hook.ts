/** Solana Agent Kit — custom send hook (no @solana/agent-kit dependency). */
import type { VersionedTransaction } from "@solana/web3.js";
import type { SoilResistanceInput } from "../../core/soil-resistance-types";
import {
  wrapSolanaSendTransaction,
  type SolanaAgentGuardInput,
  type SolanaJitoHook,
} from "../solanaAgentAdapter";

export interface VinetrailSendInterceptorOptions {
  jito?: SolanaJitoHook;
  dailyNotionalUsd?: number;
  estimatedLossUsd?: number;
  accountBalanceUsd?: number;
  criHardlock?: boolean;
  symbol?: string;
  rpcSend?: (tx: VersionedTransaction) => Promise<unknown>;
}

export function createVinetrailSendInterceptor(
  soil: SoilResistanceInput,
  opts: VinetrailSendInterceptorOptions = {},
): (tx: VersionedTransaction) => Promise<unknown> {
  const send = opts.rpcSend ?? (async () => ({ ok: true }));
  const guardInput: Omit<SolanaAgentGuardInput, "transaction"> = {
    soil,
    symbol: opts.symbol,
    dailyNotionalUsd: opts.dailyNotionalUsd,
    estimatedLossUsd: opts.estimatedLossUsd,
    accountBalanceUsd: opts.accountBalanceUsd,
    criHardlock: opts.criHardlock,
    jito: opts.jito,
  };
  return wrapSolanaSendTransaction(send, guardInput);
}
