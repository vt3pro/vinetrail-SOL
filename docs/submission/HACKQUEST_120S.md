# 120s demo script (Colosseum / video)

| Segment | Time | Action |
|---------|------|--------|
| **Problem** | 0:00–0:15 | Session keys + agent speed; simulate ≠ depth; one bad tx drains treasury before humans react. |
| **Solution** | 0:15–0:25 | Pre-broadcast gateway: VersionedTx → vinetrail_core → allow \| sever (0-gas reject). |
| **Demo 1** | 0:25–0:45 | Terminal: `pnpm test` (30/30 green). Show `guardSolanaPreBroadcast` healthy → allowed. |
| **Demo 2** | 0:45–1:05 | Toxic soil → `allowed: false`, signing channel severed. Optional: `guardJitoBundlePreBroadcast` 2-tx pass / 2nd tx fail. |
| **Proof** | 1:05–1:25 | `cargo test -p vinetrail_core -p vinetrail_solana_inspector` (11/11). Flash [BENCHMARK.md](./BENCHMARK.md) p50 line. |
| **Ask** | 1:25–2:00 | Post-Colosseum: Agent Kit hook + Jito Searcher middleware; NPM `@vinetrail/vinetrail-solana`. |

**Repo:** [README.md](../../README.md) · **Q&A:** [COLLOSSEUM_QA.md](./COLLOSSEUM_QA.md)
