# Colosseum / VC diligence Q&A

## How does the Rust inspector avoid heap in the probe summary?

`SolanaTxProbe` uses fixed arrays (`ix_program_class: [u8; 32]`) — no `Vec`/`String` in the summary. `probe_versioned_tx(&[u8])` performs one bincode decode, then `stack_probe` walks static account keys only (Legacy + v0 static keys).

## What is a “Jito bundle guard” in this repo?

We do **not** decode Jito proprietary bundle wire format. We **sequentially** run `guardSolanaPreBroadcast` on each `VersionedTransaction` before your submit path calls Jito Block Engine or RPC (`guardJitoBundlePreBroadcast`, `wrapJitoBundleSend`). Fail-closed on first trip.

## How is this different from RPC `simulateTransaction`?

Simulate is **post-build, RPC-dependent**, and does not sever signing channels. We are **pre-broadcast, deterministic `no_std` vinetrail_core**, **0-gas reject**, with **R17/R20** physical halt.

## Solana has no ERC-7579 PreExecHook—so what are you?

The **off-chain co-processor** inserted at sign/send time—the closest practical hook for session-key agents today.

## Are Pyth/Jupiter/Orca depths trustless?

**Agent-declared** at guard time (honest in README). Structural probe checks program layout, not opaque swap notionals. Mandate / venue drift gates reduce policy bypass.

## Test SSOT?

| Bar | Command | Count |
|-----|---------|-------|
| TypeScript | `pnpm test` | **30/30** (9 files) |
| Rust | `cargo test -p vinetrail_core -p vinetrail_solana_inspector` | **11/11** |

## Latency claims?

Local snapshot only: `pnpm run bench:guard` → [BENCHMARK.md](./BENCHMARK.md). Not run in CI.

## Agent frameworks?

Lightweight hook: [AGENT_KIT_INTEGRATION.md](./AGENT_KIT_INTEGRATION.md) (no Agent Kit npm dep in-tree).
