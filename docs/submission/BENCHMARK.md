# Pre-Broadcast Guard Latency (local snapshot)

Generated: 2026-09-26T02:50:07.034Z

Command: `pnpm run bench:guard`

Environment: host Node.js (`performance.now()`). Not a production Jito/edge claim.

## `guardSolanaPreBroadcast` (single VersionedTransaction)

| Samples | 10000 |
| p50 | 0.0115 ms |
| p95 | 0.0316 ms |
| p99 | 0.1711 ms |

## `guardJitoBundlePreBroadcast` (3 txs, mean per bundle call)

| Mean | 0.0170 ms |

## `vinetrail_core` (host Rust, release)

Command: `pnpm run bench:soil` (`cargo run --example bench_eval -p vinetrail_core --release`)

| Function | p50 | p99 |
|----------|-----|-----|
| `eval_soil` | 0.026 µs | 0.028 µs |
| `check_soil_resistance` | 0.026 µs | 0.028 µs |

Inspector probe output is **stack-only** (`SolanaTxProbe`, no `Vec<Pubkey>`); bytes path uses one bincode decode then `stack_probe`.

