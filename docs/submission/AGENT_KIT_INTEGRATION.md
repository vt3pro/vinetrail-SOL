# Solana Agent Kit integration (lightweight hook)

No `@solana/agent-kit` dependency in this repo. Wire Vinetrail at the **custom send** / RPC layer where Agent Kit hands off a signed `VersionedTransaction`.

## Hook

[`src/adapters/integrations/agent-kit-hook.ts`](../../src/adapters/integrations/agent-kit-hook.ts):

```typescript
import type { VersionedTransaction } from "@solana/web3.js";
import { createVinetrailSendInterceptor } from "./src/adapters/integrations/agent-kit-hook";

const soil = {
  symbol: "SOL",
  pythPriceUsd: 150,
  jupiterDepthUsd: 500_000,
  orcaDepthUsd: 500_000,
  orderSizeUsd: 500,
  accountBalanceUsd: 10_000,
  maxSlippage: 0.05,
};

const sendWithGuard = createVinetrailSendInterceptor(soil, {
  jito: { endpoint: "https://mainnet.block-engine.jito.wtf" },
  rpcSend: async (tx: VersionedTransaction) => connection.sendTransaction(tx),
});

// Agent Kit custom send path:
await sendWithGuard(signedVersionedTransaction);
```

## Bundle path

For multi-tx Jito submits, use `guardJitoBundlePreBroadcast` / `wrapJitoBundleSend` from [`src/sdk.ts`](../../src/sdk.ts) before your bundle RPC.

See [README.md](../../README.md) and [COLLOSSEUM_QA.md](./COLLOSSEUM_QA.md) for honest scope (sequential VersionedTx pre-check, not Jito wire decode).
