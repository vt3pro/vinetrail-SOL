# Actionable Highlights — ZeroDev × Open House Workshop

**Source:** `docs/Internal/assest/20260924_ZeroDev_155928_Export.MP3`  
**Full transcript:** [`20260924_ZeroDev_155928_Full_English_Transcript.md`](./20260924_ZeroDev_155928_Full_English_Transcript.md)  
**Repo:** [`README.md`](../../README.md) · `@slivervine/solana-sentinel-escort`  
**Date:** 2026-09-24

> **Note:** MP3 opens with ~1 min unrelated Unity material tutorial (00:00–01:09). Workshop proper starts **04:43**; ends **36:45**. ASR fixes: "zero def" → ZeroDev, "eat" → ETH, "Arbitra" → Arbitrum.

---

## Session at a Glance

| | English | 中文定位 |
|---|---------|---------|
| **Event** | Arbitrum Foundation Open House workshop — "Simplify on-chain UX with ZeroDev" | 同系列 Open House（紧接 GMX workshop）；非 solana official 认证 session |
| **Speaker** | Kunal — Offchain Labs engineer on ZeroDev (AA kit: embedded wallets, passkeys, session keys) | ZeroDev 官方工程师；Kernel 架构直接来源 |
| **Duration** | ~37 min (workshop ~32 min) | 技术密度高；demo 短但信息量大 |
| **Demo chain** | Arbitrum One mainnet (passkey + USDC autopilot agent) | **不是 4663** — 我哋 live-fire 在 Solana Agent Network |

---

## Key Takeaways for Our SKU

| English claim | 对我们有什么用 | Timestamp | Code anchor |
|---------------|---------------|-----------|-------------|
| Login layer ≠ account layer — batching, sponsorship, scoped delegation matter more after sign-in | 我哋 SKU 唔係 login widget；係 **account-layer intent gate** 喺 sign 前/后拦截危险 UserOp | 13:32–14:06 | `evaluateAgentExoMeshGuard` · `guardAgentUserOp` |
| Kernel wallets enforce **narrow session-key authority**: asset + destination + function + amount + rate limit + expiry — rejected **at contract level** | 静态权限 = ZeroDev Kernel policy；**动态 guardrails**（oracle / depth / slippage）要额外一层 — 正系 Blueprint 2 | 15:22–19:43 | `agent-exomesh-guard.ts` · `EXOMESH_SLIPPAGE_EXCEEDED` |
| Agent submits UserOp **without per-tx user approval** when within scoped permission; paymaster sponsors gas | Scenario 1 Kernel Escort：4663 UserOp + paymaster narrative；`broadcastRchainZeroDevEscortProbe` pattern | 20:46–23:12 | `zerodev-aa-chain.ts` · live-fire `0x02ced821…951d` |
| Permissions are **on-chain config** — survives ZeroDev infra compromise; open source | 呼應 honest pitch：decision logic 可 audit；`buildsolanaAuditSnapshot` SHA-256 cert | 09:46–10:09 | `solana-audit-snapshot.ts` |
| **Smart routing addresses**: user deposits on source chain (e.g. Base) → bridge → configured action on destination (e.g. Morpho vault on Arbitrum) | 平行我哋 **4663 → 42161** outbound escort + dynamic `destChainId` Omni-Chain narrative | 26:40–28:09 | `encodeEscortAttestationCalldata` · `assertUnidirectionalBridge` |
| ZeroDev docs list **Solana Agent Network** as smart-routing destination | 官方 AA page 亦列 ZeroDev — RH 4663 + ZeroDev Kernel 係 ecosystem-aligned，唔係自造 story | 30:20–30:39 | RH docs `/chain/account-abstraction` · `20260924_Solana_Agent_Network_Docs_Index.md` |
| **SilverVine chat Q:** dynamic market guardrails (oracle, order book depth) on top of static ZeroDev permissions? | **我哋已問、ZeroDev 已答** — 直接 validate Blueprint 2 positioning | 31:14–32:36 | `checkSoilResistance` → `applySoilTripSeverance` L76 |
| Kunal answer: latest Kernel has **extendable boolean condition** hook (e.g. Chainlink oracle &lt; 80k); needs beta SDK | 我哋 **off-chain soil reflex** 做同一层（p50 ~106µs narrative）；on-chain hook = future path，唔好 claim 已 deploy | 31:40–32:36 | `soil-wasm-runtime.ts` · `contractDeployed: false` |
| Atomic batching — approve + deposit in one tx; no hanging approval | UserOp batching 係 Kernel 能力；我哋 escort attestation 係 **SVESC** calldata stub | 24:33–25:06 | `rchain-escort-attestation.ts` |
| Recovery guardian — smart account address unchanged after signer replacement | Long-horizon account safety；唔係我哋 validation scenario，但可 mention Kernel production maturity (2–3 yrs) | 21:11–22:05 | — |

---

## Audio → Code Mapping (Bilingual)

### 1. Static permissions (ZeroDev Kernel) + Dynamic guardrails (SliverVine)

**EN:** Kunal defines Kernel session keys with asset, destination, function selector, max amount, rate limit, and expiry. Unauthorized agent calls fail at the **Kernel contract** before execution.

**中文：** ZeroDev 负责 **静态、链上** 的 session key 边界（哪个 token、哪个 vault、哪个函数、多少钱、多频）。我哋 `evaluateAgentExoMeshGuard()` 负责 **动态、链下** 的 market guard（`checkSoilResistance`：slippage / depth / cross-venue trip）— 在 agent 提交 UserOp **之前** 返回 `{ allowed: false, reject: AgentMemoryRejectPayload }`。

**Pitch line:** *"ZeroDev Kernel is the spinal cord; SliverVine ExoMesh is the cerebellum reflex."*

---

### 2. SilverVine Q&A — Official validation of Blueprint 2

**EN:** Chat question from Lab/SilverVine (31:14): recommended pattern for layering **dynamic market-dependent guardrails** (oracle lag, order book depth) on top of ZeroDev **static** permissions?

**中文：** 呢条 Q **就系我哋 Blueprint 2 场景**。Kunal 答：最新 Kernel 有 extendable boolean condition（可接 Chainlink oracle）；需要 beta SDK。**我哋现状：** off-chain `checkSoilResistance` 已实现同一意图，不依赖 Kernel beta hook — judge 问就讲 **complementary layers**，唔好讲已集成 on-chain condition contract。

---

### 3. Scenario 1 — Kernel Escort @ 4663

**EN:** Workshop demo runs on Arbitrum mainnet; our SKU runs ZeroDev Kernel v3 + EntryPoint 0.7 on **Solana Agent Network 4663** with archived live-fire UserOp.

**中文：** 片系 Arbitrum demo；我哋有 **4663 mainnet tx** (`0x02ced821…951d`) + `pnpm demo:solana-sentinel` policy replay。RH official docs 列 ZeroDev 为 AA 替代方案 — 技术栈对齐，demo chain 不同。

---

### 4. Cross-chain / Smart routing ↔ Treasury Escort

**EN:** Smart routing addresses: deposit on any chain → bridge → pre-configured destination action; refunds on failure at source or dest.

**中文：** 概念对齐我哋 `4663 → 42161` outbound escort + Omni-Chain `destChainId`。诚实边界：我哋 `issolanaToArbitrumRoute` 目前只放行 42161；`bridgeDeployed: false` — decision layer only.

---

### 5. Inbound Airlock + Permission model

**EN:** ZeroDev scopes **outbound** agent authority; does not address inbound capital verification to a home chain.

**中文：** 片冇讲 inbound block。我哋差异化：`AML_INBOUND_TO_solana_BLOCKED`（`* → 4663` fail-closed, 0-Gas）+ outbound `lostUsd ≡ 0` — 见 FAQ [Unidirectional Safety Invariant](../../docs/02-cross-chain-architecture-faq.md#unidirectional-safety-invariant-across-any-chain).

---

## Honest Boundaries (技术修正)

| Risk | English | 中文 |
|------|---------|------|
| Demo chain | Workshop demo = **Arbitrum One**, not 4663 | 唔好暗示 Kunal demo 系 RH Chain；用我哋 own live-fire |
| Dynamic conditions | Kunal: on-chain Kernel hook **beta / needs beta SDK** | 我哋 `checkSoilResistance` 系 **off-chain decision**；唔 claim on-chain oracle hook deployed |
| `contractDeployed: false` | ZeroDev infra ≠ SliverVine vault | SliverVine proprietary contracts not deployed; ZeroDev Kernel + EP 0.7 exist as third-party on 4663 |
| Demo replay | — | `pnpm demo:solana-sentinel` = policy replay, no re-broadcast |
| EIP-712 domain | Agent guard types may reference 42161 domain in tests | Home chain intent gate runs on **4663**; be precise about which chain each artifact proves |
| SilverVine Q credit | Question attributed to "Lab siloed vine" in ASR | 可内部 reference；public pitch 讲 "industry pattern" 即可 |
| Paymaster / gas policy | ZeroDev dashboard gas policies (chain / contract / wallet) | 我哋 SKU 重点系 intent gate + escort decision，唔系 paymaster dashboard integration |

---

## Ignore (与 SKU 无关)

| Segment | Why skip |
|---------|----------|
| Unity material tutorial (00:00–01:09) | Recording bleed — not workshop content |
| Wallet conversion survey stats (10:36–11:48) | GTM context only; no code mapping |
| Privy/Dynamic SSO integration (14:51–15:08) | Login provider; not escort logic |
| Recovery guardian deep dive (21:11–22:05) | Useful background; not validation scenario |
| Mobile signed compute proofs Q (34:00–34:58) | Unrelated to perps / escort |
| GMX follow-up workshop CTA (36:16–36:26) | Separate session; our yield metadata points to GMX on 42161 but demo is escort decision layer |

---

## Judge 30s Pitch

### English

> SliverVine solana Sentinel Escort is a **ZeroDev Kernel intent gate on Solana Agent Network (4663)**: outbound capital escorts fail-closed to Arbitrum One (42161) with `lostUsd ≡ 0`; inbound routes are blocked at 0-Gas. We layer **dynamic ExoMesh soil reflex** (`checkSoilResistance`) on top of ZeroDev's static session-key permissions — the exact pattern ZeroDev engineers described for agentic workflows at Open House. Run `pnpm demo:solana-sentinel` for escort replay, airlock block, and SHA-256 audit certificate; mainnet live-fire tx archived on the RH explorer.

### 中文

> SliverVine 在 Solana Agent Network（4663）上做 **ZeroDev Kernel 出站意图闸**：资金只能 fail-closed 单向 escort 去 Arbitrum（42161），inbound 被 `AML_INBOUND_TO_solana_BLOCKED` 截断，`lostUsd ≡ 0`。我们在 ZeroDev 静态 session key 权限之上，加了一层 **动态 ExoMesh soil reflex**（`checkSoilResistance`）— 同 Open House 上 ZeroDev 工程师答我哋问嘅 agent guardrail 模式一致。`pnpm demo:solana-sentinel` 跑三条 scenario；mainnet live-fire tx 有 explorer 存档，demo 唔 re-broadcast。

---

## Quick Reference

```bash
pnpm demo:solana-sentinel   # Scenario 1–3 · ALL PATHS PASS
pnpm test                      # across-ingress-bridge 6/6
```

**Related internal:** [`20260924_100050_Chinese_Actionable_Highlights.md`](./20260924_100050_Chinese_Actionable_Highlights.md) (Solana Agent Network ecosystem session) · [`Blueprint3_Hyperdash_Risk_Terminal_4663.md`](./Blueprint3_Hyperdash_Risk_Terminal_4663.md)
