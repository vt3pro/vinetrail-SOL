# Solana pre-broadcast architecture

Vinetrail-Solana is a **Sub-ms Pre-Broadcast Agent & Jito Bundle Risk Gateway**: intent is audited before Solana RPC or Jito Block Engine submit.

## Technical pillars

1. **Sub-ms `#![no_std]` Wasm Core** — `vinetrail_core` evaluates Pyth / Jupiter / Orca lanes with **R17** / **R20** circuit breakers; TypeScript calls `checkSoilResistance` on the hot path.
2. **Jito Bundle & VersionedTx Intent Guard** — `guardSolanaPreBroadcast` and `wrapSolanaSendTransaction` run the same gate on the signing pipeline; `vinetrail_solana_inspector` optionally probes legacy + v0 `VersionedTransaction` bytes in Rust tests.
3. **0-Gas Fail-Closed Protection** — Trips sever the signing channel (`severSigningChannel`, `rootProtection`) without broadcasting rejected payloads (no Gas/CU wasted on reject).

```text
Agent VersionedTransaction
        │
        ▼
  solanaAgentAdapter (TS)
        │
        ├─► vinetrail_solana_inspector (Rust, optional native probe)
        └─► vinetrail_core eval + R17/R20
        │
        ▼ allowed
   Solana RPC / Jito Block Engine
```

Economic lanes (`orderSizeUsd`, depth, balances) are supplied by the agent runtime. The inspector does not decode swap amounts from opaque instruction data.
