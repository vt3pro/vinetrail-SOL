# 10-second pitch

## English

Solana AI agents sign at machine speed—wallet simulate misses Jupiter/Orca depth and can’t fail-closed before Jito or RPC. **Vinetrail-Solana** is a sub-ms Rust Wasm co-processor in the **signing pipeline**: toxic trades rejected with **zero gas**, signing channel severed on R17/R20. **30/30 Vitest, 11/11 Rust—`guardSolanaPreBroadcast` in one line.**

**Proof:** `pnpm test` · latency: [BENCHMARK.md](./BENCHMARK.md)

## 中文

Solana AI Agent 用 session key 以机器速度签名，钱包模拟看不懂深度，也拦不住 Jito/RPC 路径上的坏单。**Vinetrail-Solana** 是签名管线里的 **亚毫秒 Rust Wasm 风控共处理器**：毒性交易 **零 Gas 拒绝**，R17/R20 物理熔断。**30/30 Vitest、11/11 Rust，一行 `guardSolanaPreBroadcast` 接入。**

**证据：** `pnpm test` · 延迟：[BENCHMARK.md](./BENCHMARK.md)
