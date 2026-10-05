/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 SilverVine Labs
 * Vinetrail-Solana — agent session & attestation SSOT.
 */

/** Hard USD notional cap for session-key authorization (R17 alignment). */
export const SESSION_KEY_NOTIONAL_CAP_USD = 5_000;

/** Numeric tag for agent intent mandate / venue policy. */
export const AGENT_INTENT_CHAIN_TAG = 900 as const;

/** Agent intent EIP-712 domain wire name. */
export const GATE_EIP712_DOMAIN_EXOMESH_WIRE = "SliverVineExoMesh" as const;
export const GATE_EIP712_DOMAIN_WIRE = GATE_EIP712_DOMAIN_EXOMESH_WIRE;
export const EIP712_DOMAIN_NAME = GATE_EIP712_DOMAIN_EXOMESH_WIRE;
export const EIP712_DOMAIN_VERSION = "1" as const;

export function resolveGateEip712DomainName(_clusterTag?: number): string {
  return GATE_EIP712_DOMAIN_EXOMESH_WIRE;
}
