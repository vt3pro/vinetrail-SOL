# Strategic Roadmap (Internal)

**Internal — not part of public product narrative.** Public SSOT: [README.md](../../README.md), [JUDGE_BRIEF.md](../../JUDGE_BRIEF.md).

Post–Option C expansion plan for Vinetrail-Solana and adjacent SilverVine products.

### Engineering SSOT

- **[multi-repo-ssot.json](../_snippets/multi-repo-ssot.json)** — 三 SKU 仓 slug、venue、shared `vinetrail_core`、禁用遗留 `vinetrail-*` token 列表。
- **[MULTI_REPO_OPS_AND_LOGGING_SSOT.md](./MULTI_REPO_OPS_AND_LOGGING_SSOT.md)** — One Core / Three Thin Adapters、git submodule 防漂移、`RiskAuditSnapshot` JSON、Solana / Hyperliquid / Tempo 链上锚定、Judge FAQ。

---

## Phase 0: Colosseum World's Fair Sprint (Current SSOT)

- [x] `#![no_std]` Rust `vinetrail_core` Wasm engine integration.
- [x] Sub-ms `VersionedTransaction` & Jito bundle-path pre-flight inspector.
- [x] Pyth / Jupiter / Orca soil resistance & R17/R20 circuit breakers.
- [x] 100% PASS Vitest (30/30) & Rust (11/11) test suites.
- [x] `guardJitoBundlePreBroadcast` + local `pnpm run bench:guard` → `docs/submission/BENCHMARK.md`.
- [x] Colosseum submission pack (`docs/submission/`).

---

## Phase 1: Post-Hackathon Integration & Ecosystem Partnerships (Q4 2026)

- [ ] **Agent Framework Plugins**: Native adapters for Solana Agent Kit, ElizaOS, and Wayfinder.
- [ ] **Jito Searcher / RPC Gateway Integration**: Middleware for Jito Searchers to filter toxic flow.
- [ ] **SDK Distribution**: NPM `@vinetrail/vinetrail-solana` release for Chrome Extensions / Wallet Providers.

---

## Phase 2: RWA & Institutional Capital Safeguards (Q1 2027)

- [ ] **Token-2022 Permission Matrix**: Monitor FreezeAuthority and PermanentDelegate risk on Token-2022 mints.
- [ ] **Institutional Treasury Circuit Breakers**: Extend R17/R20 state machines to corporate multi-sig wallets handling RWA collateral.

---

## Phase 3: Multi-Chain Unified Risk Co-Processor (Q2 2027)

- [ ] Unify `vinetrail-Solana` (SVM), `vinetrail-hyperliquid` (Hyperliquid), and `vinetrail-tempo` (EVM/Tempo) under shared `vinetrail_core` + cross-chain telemetry HUD (`slivervine.xyz`). **Repo slugs:** [multi-repo-ssot.json](../_snippets/multi-repo-ssot.json). **Ops / logging:** [MULTI_REPO_OPS_AND_LOGGING_SSOT.md](./MULTI_REPO_OPS_AND_LOGGING_SSOT.md).
