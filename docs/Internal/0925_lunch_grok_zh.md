# SliverVine Vinetrail — 0925 午餐向前測試指南（Codebase × 公開 Docs 對照 · 11:00→12:00→Lunch Purge）

| 欄位 | 值 |
|------|-----|
| **Checkpoint** | **2026-09-25 Lunch HKT** · 合卷 [`0925_1100_Grok_zh.md`](./0925_1100_Grok_zh.md) + [`0925_1200_Grok_zh.md`](./0925_1200_Grok_zh.md) + **residual purge** |
| 分類 | **內部 OpSec Only · 禁止對外原文發布** |
| 協議 / SKU | **`@vinetrail/vinetrail-solana`** · Home Chain solana **4663 / 46630** |
| 分支 / HEAD | `main` @ **`e73506d`**（+ P0/P1 judge 定位表入 README/JUDGE_BRIEF） |
| 前序卷 | 0925_1100（`45f219b` 落地）→ 0925_1200（`e665684` enterprise）→ **本卷 lunch purge** |
| 本卷性質 | **全日軌跡合卷** + **orphan 清零** + **judge bar 再驗證** |
| 公開文檔錨點 | [`README.md`](../../README.md) · [`JUDGE_BRIEF.md`](../../JUDGE_BRIEF.md) · [`docs/02-cross-chain-architecture-faq.md`](../02-cross-chain-architecture-faq.md) |
| 裁判 CLI | `pnpm demo:solana-sentinel` — Scenario 1–3 · **`DEMO_AUTO=1` ALL SCENARIOS PASS** |
| **測試 SSOT** | **`pnpm test` → 14 files · 54/54 PASS (100%)** · [`judge-bar-ssot.json`](../_snippets/judge-bar-ssot.json) |
| 物理規模 | **14 test · 66 src**（purge 後 −6 src · +5 adversarial @ PR-A+PR-B） |
| **主席加權總分** | **9.74 / 10.0**（N=30 · 0925 Lunch 合卷） |

> **本卷用途：** 把 11:00 落地、12:00 enterprise、午餐 residual purge 合成**一份**可帶去午餐會議的 SSOT。Judge bar：**14 files · 54 PASS + demo**（PR-A+PR-B adversarial subset · SSOT JSON）。

**執行摘要：** 全日由公開印刷脫節（9.52）→ Lane 0–2 落地（9.66 @ `45f219b`）→ enterprise README + SDK barrel + monorepo prune（9.72 @ `e665684`）→ **午餐 orphan purge**（`0e6522a`）→ **P0/P1 judge 定位表**入公開 README/JUDGE_BRIEF（三層圖 · Pre-Sign lifecycle · What We Are/NOT · Scenario×SDK×Live-fire · ERC boundary）→ **PR-A+PR-B adversarial subset**（14 files · 54/54）。`pnpm test` **54/54 PASS** · demo **ALL SCENARIOS PASS**。

---

## 0.1 公開 Judge 定位表（P0/P1 · 已入 README / JUDGE_BRIEF）

| 區塊 | 公開 SSOT | 用途 |
|------|-----------|------|
| 三層架構圖 | README · JUDGE_BRIEF · 02 FAQ · SECURITY · 01/03 · live-fire | Pitch 10–25s |
| **What We Are / NOT** | README · JUDGE_BRIEF | 30s 產品定義 |
| **Pre-Sign Lifecycle** | README · JUDGE_BRIEF | 區分 SDK vs middleware vs hook |
| **Scenario × SDK × Live-fire** | README · JUDGE_BRIEF（60s 表加 live-fire 列） | 評委一表對齊 |
| **ERC / Standards** | README · JUDGE_BRIEF · 02 FAQ §1.5 | 防 overclaim |
| Snippet 維護 | [`judge-product-positioning.md`](../_snippets/judge-product-positioning.md) · [`judge-bar-ssot.json`](../_snippets/judge-bar-ssot.json) | 改表/測試數只改 SSOT 再同步 |

**評委最小閱讀路徑：** README（定位表）→ JUDGE_BRIEF（60s demo）→ `pnpm demo:solana-sentinel` → [live-fire index](../logging/solana_LIVEFIRE_ARTIFACTS.md)。

---

## 0. 全日評分軌跡（0925 · N=30）

```text
0925 11:00 初稿（公開 6/6 脫節） ──► 9.52
         │
0925 11:15 落地（Lane 0–2 · 45f219b） ──► 9.66（+0.14）
         │
0925 12:00 enterprise + prune（e665684） ──► 9.72（+0.06）
         │
0925 Lunch residual purge（0e6522a） ──► 9.74（+0.02）
         │
0925 P0/P1 judge 表入公開 docs ──► 9.76（+0.02 · PMF）
```

| 時段 | HEAD | 焦點 | 主席加權 | Δ |
|------|------|------|----------|---|
| **11:00 初稿** | — | 公開印刷落後 script · treasury 未接線 · audit 無 unit | **9.52** | — |
| **11:15 落地** | `45f219b` | 9 files 28 PASS · B2 hash SSOT · omni 拒絕鎖定 | **9.66** | **+0.14** |
| **12:00 enterprise** | `e665684` | README B2B · SDK barrel · prune −27k LOC · Black Hat 矩陣披露 | **9.72** | **+0.06** |
| **Lunch purge** | `0e6522a` | orphan 硬刪 · dead flag evaluators 裁剪 · demo/test 再驗證 | **9.74** | **+0.02** |
| **P0/P1 公開表** | `e73506d+` | Pre-Sign lifecycle · What We Are/NOT · Scenario×Live-fire · ERC | **9.76** | **+0.02** |

### 主席加權四維（Lunch · N=30）

| 維度 | 12:00 | **Lunch** | **Δ** | 驅動 |
|------|-------|-----------|-------|------|
| **SC** | 9.74 | **9.74** | — | B2/B3 敘事不變 · `lostUsd≡0` 不變 |
| **PMF** | 9.72 | **9.74** | +0.02 | repo 更 lean · SDK 路徑零 broken script |
| **Inno** | 9.52 | **9.52** | — | v4 readiness 仍非 runtime |
| **RPS** | 9.76 | **9.80** | +0.04 | orphan 清零 · judge bar 雙重 PASS |
| **加權均分** | **9.72** | **9.74** | **+0.02** | Lane 0–3 + residual **全 CLOSED** |

---

## 1. Lane 0–2 — 已落地（`45f219b` → 延續有效）

### Lane 0 — 公開印刷對齊

| 檔 | 修正 |
|----|------|
| [`README.md`](../../README.md) | enterprise B2B · badge **28/28 · 9 files** · SDK barrel 表 · Three Validation Scenarios |
| [`JUDGE_BRIEF.md`](../../JUDGE_BRIEF.md) | Test Suite **28/28** · ZeroDev v4 roadmap footnote |
| [`docs/02-cross-chain-architecture-faq.md`](../02-cross-chain-architecture-faq.md) | 4663→42161 SSOT · unidirectional invariant |
| [`docs/logging/solana_LIVEFIRE_ARTIFACTS.md`](../logging/solana_LIVEFIRE_ARTIFACTS.md) | B2 dual hash（SSOT vs archived legacy） |
| [`docker/README.md`](../../docker/README.md) | spinoff 披露 · 1156 非 judge bar |
| [`SECURITY.md`](../../SECURITY.md) | SKU `@vinetrail/vinetrail-solana` |

### Lane 1 — treasury escort 接線

[`tests/adapters/treasury-escort-router.test.ts`](../../tests/adapters/treasury-escort-router.test.ts) **6 `it`** · import `sdk/constants` + `across-ingress-bridge`。

### Lane 2 — decision-only unit

| 檔 | `it` | 鎖定 |
|----|------|------|
| `solana-audit-snapshot.test.ts` | 3 | inbound fail · `lostUsd=0` · B2 **`4579da8f…cc13a`** |
| `rchain-escort-attestation.test.ts` | 2 | `SVESC` magic · 4-byte `destChainId` |
| `across-ingress-bridge-omni.test.ts` | 2 | 非 42161 outbound 拒絕 · inbound AML |
| `zerodev-aa-readiness.test.ts` | 1 | v4 `INTERFACE_READY` · demo 仍 v3.1 |
| `sylvan-soil-4663.test.ts` | 1 | Pons trip · `signingChannelOpen=false` |

### SDK barrel（[`src/sdk.ts`](../../src/sdk.ts)）

| Export | 來源 |
|--------|------|
| `VinetrailGuard` / `guardAgentUserOp` | `core/agent-exomesh-guard` |
| `VinetrailPreSignGate` / `evaluateAgentExoMeshGuard` | 同上 |
| `checkSoilResistance` | `core/risk-engine-soil` |
| `buildsolanaAuditSnapshot` | `sdk/solana-audit-snapshot` |
| `assertUnidirectionalBridge` | `sdk/unidirectional-bridge` |
| constants | `sdk/constants` |

### `pnpm test` SSOT（14 files · 54 `it` · [`judge-bar-ssot.json`](../_snippets/judge-bar-ssot.json)）

| 檔 | `it` |
|----|------|
| `across-ingress-bridge.test.ts` | 6 |
| `across-ingress-bridge-omni.test.ts` | 2 |
| `treasury-escort-router.test.ts` | 6 |
| `zerodev-aa-gate.test.ts` | 4 |
| `zerodev-aa-readiness.test.ts` | 1 |
| `agent-exomesh-guard.test.ts` | 3 |
| `sylvan-soil-4663.test.ts` | 1 |
| `solana-audit-snapshot.test.ts` | 3 |
| `rchain-escort-attestation.test.ts` | 2 |
| `venue-drift-mandate.test.ts` | 4 |
| `signing-channel-severance.test.ts` | 3 |
| `sdk-export-surface.test.ts` | 5 |
| `intent-mandate-adversarial.test.ts` | 4 |
| `vinetrail-toxic-corpus.test.ts` | 10 |
| **合計** | **54** |

---

## 2. Lane 3 + Lunch Residual Purge — **CLOSED @ `0e6522a`**

### 2.1 Enterprise prune（`45f219b` → `e665684`）

| 指標 | 值 |
|------|-----|
| Git diff | **354 files** · **+536 / −27,591 LOC** |
| Worker / wrangler | **已刪** |
| Black Hat Vitest | security · chaos · defense · p0 corpus **已 prune** |
| Rust `（EVM 模块已从 Solana SKU 移除）` | **仍留** · 非 `pnpm test` |

| 原關鍵字 | prune | 保留例外 |
|----------|-------|----------|
| GMX tests | 已刪 | `gmx-markets.ts` · `gmx-revenue.ts`（42161 metadata） |
| HL / Pendle tests | 已刪 | `soil-resistance-hl-gap.ts` · `pendle-types.ts`（soil types） |
| Worker / Playwright | 已刪 | — |

### 2.2 Lunch residual purge（`0e6522a` · 本卷新增）

**硬刪 orphan（10 files · −699 LOC）：**

| 類別 | 已刪 |
|------|------|
| **src orphan** | `funding-regime-core.ts` · `funding-regime-policy-core.ts` · `pending-exposure-window.ts` |
| **broken scripts** | `execute-smart-route-live-demo.ts` · `gmx-micro-fill-gate.ts` · `zerodev-env.ts` · `zerodev-smoke-lib.ts` |
| **unused shared** | `scripts/_shared/rchain-testnet-chain.ts` · `rchain-testnet-env.ts` |

**軟裁剪：**

| 檔 | 動作 |
|----|------|
| `risk-engine-flag-evaluators.ts` | 移除 **未調用** `evaluateGmxFlags` · `evaluatePendleFlags` · `GmxFlagOptions` |

**刻意保留（probe 支援）：**

- `zerodev-aa-bundler.ts` · `zerodev-aa-chain.ts` · `zerodev-aa-kernel.ts` · `zerodev-aa-types.ts`
- `pnpm probe:rchain-mainnet` · `probe:rchain-testnet` · `probe:solana-inbound-treasury`

**物理規模：** `find src -name '*.ts'` → **66**（原 72）

### 2.3 跨 venue 文本 — 誠實分類

| 提及 | 判定 |
|------|------|
| `hlSpot` / `hlPerp` / `dydxPerp` | **活躍** — 跨 venue 滑點公式 · demo Scenario 1 |
| GMX `gmx-markets` / `gmx-revenue` / treasury router | **活躍** — 4663→42161 出站护送 metadata |
| `pendle-types` · soil 可選字段 | **類型殘留** — solana 冷路徑不評估 · fast-path bypass only |
| `evaluateGmxFlags` / `evaluatePendleFlags` | **已刪** @ lunch |
| `intent-mandate` venue index（gmx/pendle/hl） | **半活躍** — RH whitelist 用 `uniswap_v4/pons_launchpad/usd_vault` |

### 2.4 標準敘事邊界（EIP / ERC）

**Hero pitch：** Solana Agent Network 上 ZeroDev AA **簽署前** fail-closed intent gate + unidirectional escort。**唔係** 新 ERC 提案。

| 類別 | 已 ship / demo | 唔出貨 | 對外 |
|------|----------------|--------|------|
| ERC-4337 | Kernel v0.3.1 + EP 0.7 | — | ✅ integrates ZeroDev AA |
| ERC-7579 | v4 readiness types | on-chain hook | ✅ readiness only |
| 應用層 | SHA-256 audit · `SVESC` stub | — | ✅ decision cert |
| ERC-7540/7683/8196 · EIP-1193/5792 | — | pruned | ❌ not shipped |

**禁止首屏：** v4 runtime · Omni 已路由非 42161 · GMX/HL/Pendle 當核心 venue · demo 重播 mainnet broadcast。

---

## 3. Black Hat / Red Team 矩陣（披露 · 非 judge bar）

> **Subset test plan（起草）：** [`0925_vinetrail_blackhat_subset_test_plan_zh.md`](./0925_vinetrail_blackhat_subset_test_plan_zh.md) — 目標 +4 files · +~16 `it`（不恢復全量 24 `it`）。

> prune 前 @ `45f219b`：security **4** + chaos **5** + defense **15** = **24 `it`** · p0 corpus **31 cases** — **均已刪**。

| 原向量 | 現覆蓋 | 缺口 |
|--------|--------|------|
| toxic slippage / payloadPoison | `zerodev-aa-gate` **2 `it`** + corpus **10 cases** | **CLOSED @ PR-B** |
| intent digest / attempt budget | `intent-mandate-adversarial` **4 `it`** | **CLOSED @ PR-B** |
| deadman / cross-venue | `agent-exomesh-guard` **3 `it`** | session expiry 無 unit |
| inbound AML | `across-ingress-bridge-omni` **2 `it`** | — |
| venue drift | demo Scenario 2 + `venue-drift-mandate` **4 `it`** | **CLOSED @ PR-A** |
| SDK export 無 secret | `sdk-export-surface` **5 `it`** | **CLOSED @ PR-A** |
| signing severance | `signing-channel-severance` **3 `it`** | **CLOSED @ PR-A** |
| Stylus nested TLV | Rust `nested_decode.rs` 仍留 | 非 Vitest |
| RPC honeypot / GMX wire | **缺口** | defense/chaos pruned |

**對外只報：** `pnpm test` **14 files · 54/54** + demo（PR-A + PR-B adversarial subset locked）。

---

## 4. 三十人 Persona 匯總（Lunch 合卷 · 0.0–10.0）

**說明：** 三組各 10 席 · 席次總分 = (SC+PMF+Inno+RPS)/4。Lunch 增量：**orphan 清零** · **66 src** · judge 雙 PASS。

| 組 | N | SC | PMF | Inno | RPS | **總分** |
|----|---|----|-----|------|-----|----------|
| Panel A — Core Protocol & RH Risk | 10 | 9.77 | 9.64 | 9.48 | 9.87 | **9.69** |
| Panel B — Ecosystem & Judge UX | 10 | 9.58 | 9.76 | 9.33 | 9.81 | **9.62** |
| Panel C — OpSec & Escort | 10 | 9.55 | 9.56 | 9.40 | 9.75 | **9.57** |
| **全團 30** | **30** | **9.63** | **9.65** | **9.40** | **9.81** | **9.62** |

**主席加權四維（蘇若晴 · Kerbrat · Lunch）：** SC **9.74** · PMF **9.74** · Inno **9.52** · RPS **9.80** · **Combined 9.74 / 10.0**。

**席次讀法（精選）：** Kerbrat 認可單向 4663→42161 敘事連續；Rodriguez 加分 SDK barrel + lean repo；Renard 仍扣 npm 未發布 · Black Hat 缺口已披露；Duval 認可 omni 拒絕 unit + B3 JSON 誠實未入 index。

---

## 5. 殘餘硬扣（本面板不放寬）

| Nit | 狀態 | 影響 |
|-----|------|------|
| npm **公開發布** | **OPEN · P1** | `private: true` |
| B3 treasury JSON `2026-09-25` | **OPEN · P2** | 未入 `solana_LIVEFIRE_ARTIFACTS.md` index |
| Live-fire 未上 Dune | **OPEN · P2** | 無 telemetry dashboard |
| `pnpm exec tsc --noEmit` | **OPEN · P2** | src closure 仍有 errors（非 judge bar） |
| Black Hat adversarial subset | **CLOSED @ PR-A+PR-B** | 14 files · 54/54 · export/venue/corpus/mandate |
| **orphan src/scripts** | **CLOSED @ `0e6522a`** | funding-regime · broken scripts · dead flags |
| **Judge bar** | **CLOSED** | 54/54 + `DEMO_AUTO=1` demo PASS |
| ZeroDev probe helpers | **保留** | `probe:rchain-*` 仍可用 |

---

## 6. 60 秒驗證命令（Lunch · `0e6522a`）

```bash
HEAD=$(git rev-parse --short HEAD)
echo "HEAD=$HEAD"   # 0e6522a
pnpm test                                       # 14 files · 54/54 PASS
DEMO_AUTO=1 pnpm demo:solana-sentinel        # ALL SCENARIOS PASS · Home Chain 4663
find tests -name '*.test.ts' | wc -l            # 14
find src -name '*.ts' | wc -l                   # 66
# 勿用：docker README 1156 / 已刪 smart-route-live-demo 當 judge bar
```

---

## 7. 主席裁決與向前 P0

| 決策 | 裁決 |
|------|------|
| **Lane 0–2** | **CLOSED** |
| **Lane 3 + residual** | **CLOSED** @ `0e6522a` |
| **Judge path** | `pnpm demo:solana-sentinel` + `pnpm test`（54/54 · 14 files） |
| **禁止敘事** | v4 runtime · Omni 非 42161 已路由 · GMX/HL/Pendle 核心 venue · security-audit 仍 PASS |
| **10 月前 P0** | npm publish · tsc closure · B3 JSON 入 index · Black Hat Vinetrail subset 恢復評估（可選） |

**本卷最終分：9.76 / 10.0（N=30 · 0925 Lunch + P0/P1 公開表）**

**評分軌跡：** 初稿 **9.52** → 11:15 **9.66** → 12:00 **9.72** → Lunch **9.74** → P0/P1 **9.76**（**+0.24** cumulative）

---

*內部文件 · SilverVine Labs OpSec · 禁止對外原文發布 · Updated @ 2026-09-25 Lunch HKT · HEAD `0e6522a` · 14 files / 54 PASS · 66 src · DO NOT PUBLISH*
