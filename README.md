# Vinetrail-Solana — Sub-ms Pre-Broadcast Agent & Jito Bundle Risk Gateway

[![Vitest](https://img.shields.io/badge/Vitest-32%2F32%20PASS%20%2810%20files%29-brightgreen?logo=vitest)](.)
[![Solana](https://img.shields.io/badge/VersionedTransaction-legacy%20%2B%20v0-9945FF?logo=solana)](.)
[![Jito](https://img.shields.io/badge/Jito-Pre--Broadcast%20Guard-000000)](.)
[![Rust](https://img.shields.io/badge/vinetrail__core-%23%5Bno_std%5D-orange?logo=rust)](.)
[![Latency](https://img.shields.io/badge/Decision-p50%20Sub--ms-blue?logo=speedtest)](.)
[![0-Gas](https://img.shields.io/badge/0--Gas-Severance-red)](.)
[![License](https://img.shields.io/badge/License-BUSL--1.1-orange)](./LICENSE)

<p align="center">
  <img src="./public/brand/logo_vinetrail.jpg" alt="Vinetrail-Solana" width="100%" />
</p>

**Stopping Malicious Solana Agent Trades & Jito Bundles in <1ms — Zero Gas, Fail-Closed, Before It Ever Hits the Network.**

`pnpm test` · `cargo test -p vinetrail_core -p vinetrail_solana_inspector` · R17/R20 deadlock severance

## Technical pillars

1. **Sub-ms `#![no_std]` Wasm Core** — Deterministic soil resistance (Pyth / Jupiter / Orca) and circuit breakers (**R17** daily loss · **R20** deadlock) via `vinetrail_core` and `checkSoilResistance`.
2. **Jito Bundle & VersionedTx Intent Guard** — Atomically audit transaction intent on the path to Jito Block Engine or Solana RPCs (`guardSolanaPreBroadcast`, `guardJitoBundlePreBroadcast`, `wrapSolanaSendTransaction`, Rust inspector probe).
3. **0-Gas Fail-Closed Protection** — Intercept toxic transactions in the signing pipeline; rejects cost no Gas/CU (`severSigningChannel`, `rootProtection`).

## Highlights

| Capability | Detail |
|------------|--------|
| **Rust `vinetrail_core`** | `#![no_std]` Wasm/rlib (`vinetrail_core_eval`, ABI v2) + R17/R20 circuit breakers |
| **Jito / RPC hook** | `wrapSolanaSendTransaction` · `wrapJitoBundleSend` — pre-broadcast before RPC or multi-tx bundle submit |
| **Solana probe** | `vinetrail_solana_inspector` — legacy + v0 `VersionedTransaction` |
| **TypeScript middleware** | `guardSolanaPreBroadcast` · soil + gateway severance |

## Architecture

```text
Agent VersionedTransaction
        │
        ▼
┌───────────────────────────────────────┐
│  solanaAgentAdapter (TypeScript)      │
│  probe → evaluateGatewayRules         │
│  checkSoilResistance → severance      │
└───────────────────────────────────────┘
        │ allowed
        ▼
   Solana RPC / Jito Block Engine
```

Rust inspector ([`crates/vinetrail_solana_inspector`](crates/vinetrail_solana_inspector)) routes decoded tx metadata into [`crates/vinetrail_core`](crates/vinetrail_core).

## Quick start

```typescript
import {
  Keypair,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  guardSolanaPreBroadcast,
  wrapSolanaSendTransaction,
} from "./src/sdk";
import type { SoilResistanceInput } from "./src/sdk";

const payer = Keypair.fromSeed(new Uint8Array(32).fill(7));
const to = Keypair.fromSeed(new Uint8Array(32).fill(9)).publicKey;
const legacy = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: to,
    lamports: 1_000,
  }),
);
legacy.feePayer = payer.publicKey;
legacy.recentBlockhash = "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTkmh1";
legacy.sign(payer);
const signedVtx = new VersionedTransaction(legacy.compileMessage());

const soil: SoilResistanceInput = {
  symbol: "SOL",
  pythPriceUsd: 150,
  jupiterDepthUsd: 500_000,
  orcaDepthUsd: 500_000,
  orderSizeUsd: 500,
  accountBalanceUsd: 10_000,
  maxSlippage: 0.05,
};

const verdict = guardSolanaPreBroadcast({ transaction: signedVtx, soil });
if (!verdict.allowed) {
  throw new Error(verdict.reasons.join("; "));
}

const sendGuarded = wrapSolanaSendTransaction(
  async (_tx: VersionedTransaction) => ({ signature: "demo" }),
  { soil },
);
await sendGuarded(signedVtx);

// Optional: Jito bundle path (sequential VersionedTx pre-check, not Jito wire decode)
import { guardJitoBundlePreBroadcast } from "./src/sdk";
const bundleVerdict = guardJitoBundlePreBroadcast({
  transactions: [signedVtx, signedVtx],
  soil,
});
```

```bash
cargo test -p vinetrail_core -p vinetrail_solana_inspector
pnpm test
pnpm run bench:guard   # optional → docs/submission/BENCHMARK.md
pnpm run build:wasm   # optional → pkg/vinetrail_core.wasm
```

## Dynamic Max SL (SSOT)

`Dynamic Max SL = Account Balance × 1% + $100` — enforced in `vinetrail_core` and `vineWrapProtection`.

## Honesty

Economic fields (`orderSizeUsd`, depth, balances) are **agent-declared**. The inspector does not infer swap notionals from opaque instruction bytes. **Bundle guard** = sequential `VersionedTransaction` pre-check before your Jito/RPC submit (see [COLLOSSEUM_QA.md](./docs/submission/COLLOSSEUM_QA.md)).

## SDK exports

| Export | Role |
|--------|------|
| `guardSolanaPreBroadcast` | Sync pre-broadcast gate |
| `guardJitoBundlePreBroadcast` | Sequential multi-tx bundle pre-check |
| `wrapSolanaSendTransaction` | RPC/Jito send wrapper |
| `wrapJitoBundleSend` | Bundle submit wrapper |
| `checkSoilResistance` | Soil slippage / depth fuse |
| `VinetrailGuard` / `guardAgentPreSign` | Agent intent + soil evaluation |

Product brief: [JUDGE_BRIEF.md](./JUDGE_BRIEF.md) · Colosseum pack: [docs/submission/](./docs/submission/)
