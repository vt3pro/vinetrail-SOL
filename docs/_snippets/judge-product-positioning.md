## What we are

| We **are** | We are **not** |
|------------|----------------|
| B2B **pre-broadcast** risk SDK for Solana agents | An RPC proxy or block engine |
| `#![no_std]` Rust `vinetrail_core` + TS middleware | A wallet or signing service |
| Jito / RPC hook via `wrapSolanaSendTransaction` | On-chain risk oracle (decision is off-chain) |

## Validation scenarios

| Scenario | SDK | Validation |
|----------|-----|-------|
| Pre-broadcast allow | `guardSolanaPreBroadcast` + healthy soil | Vitest `solana-agent-adapter` |
| Soil trip + severance | `checkSoilResistance` | `signing-channel-severance` |
| Toxic corpus | soil + gateway + agent guard | `vinetrail-toxic-corpus` |
