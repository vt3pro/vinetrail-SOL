/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 SilverVine Labs
 * Vinetrail-Solana SDK barrel — pre-broadcast decision layer.
 */
export * from "./sdk/constants";
export {
  evaluateAgentExoMeshGuard,
  guardAgentPreSign,
  VinetrailGuard,
  VinetrailPreSignGate,
} from "./core/agent-exomesh-guard";
export { checkSoilResistance } from "./core/risk-engine-soil";
export type { SoilResistanceInput } from "./core/soil-resistance-types";
export {
  guardSolanaPreBroadcast,
  wrapSolanaSendTransaction,
  type SolanaAgentGuardInput,
  type SolanaAgentGuardResult,
  type SolanaJitoHook,
} from "./adapters/solanaAgentAdapter";
export {
  guardJitoBundlePreBroadcast,
  wrapJitoBundleSend,
  type JitoBundleGuardInput,
  type JitoBundleGuardResult,
} from "./adapters/solana/solana-jito-bundle-guard";
