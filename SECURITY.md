# Security — Vinetrail-Solana

## Threat model

- **In scope:** Malicious or mistaken agent transactions **before** they reach Solana validators (RPC / Jito bundle submit).
- **Out of scope:** On-chain program exploitation after broadcast; wallet key extraction; RPC provider compromise.

## Design guarantees

1. **Fail-closed:** Soil trip, R17/R20 breach, or poisoned payload → block send + `severSigningChannel` where applicable.
2. **0-gas decision:** Risk evaluation runs off-chain; no protocol transaction required to reject.
3. **No amount inference:** Swap/lamport notionals are agent-declared; structural tx probe only (program ids, ix counts).

## Reporting

Contact SilverVine Labs via repository security policy channels. Do not open public issues for key material or live-fire exploits.
