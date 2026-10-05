# Vinetrail-Solana — Product Brief

**Sub-ms Pre-Broadcast Agent & Jito Bundle Risk Gateway**

## One-minute pitch

**Stopping Malicious Solana Agent Trades & Jito Bundles in <1ms — Zero Gas, Fail-Closed, Before It Ever Hits the Network.**

Agents sign Solana `VersionedTransaction` payloads at machine speed. Vinetrail-Solana **blocks or severs before broadcast** to RPC or Jito Block Engine — zero on-chain gas for the decision layer.

## Technical pillars

- **Sub-ms `#![no_std]` Wasm Core** — Pyth / Jupiter / Orca soil resistance; **R17** / **R20** circuit breakers (`vinetrail_core`).
- **Jito Bundle & VersionedTx Intent Guard** — Pre-flight audit via `guardSolanaPreBroadcast`, `guardJitoBundlePreBroadcast`, and send wrappers.
- **0-Gas Fail-Closed Protection** — Signing-pipeline intercept; no Gas/CU spent on reject.

## Verification

```bash
cargo test -p vinetrail_core -p vinetrail_solana_inspector
pnpm test
```

## Primary APIs

| API | Role |
|-----|------|
| `guardSolanaPreBroadcast` | Pre-broadcast gate on `VersionedTransaction` |
| `guardJitoBundlePreBroadcast` | Sequential bundle pre-check |
| `wrapSolanaSendTransaction` | RPC/Jito send interceptor |
| `wrapJitoBundleSend` | Bundle submit interceptor |
| `checkSoilResistance` | Soil fuse + auto-severance |
| `VinetrailGuard` / `guardAgentPreSign` | Agent intent + soil evaluation |

## Architecture

```text
VersionedTransaction → solanaAgentAdapter → (allowed?) → RPC / Jito
                              ↓
                    vinetrail_core + severance
```

Full hero doc: [README.md](./README.md)
