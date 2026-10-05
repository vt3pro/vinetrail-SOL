# Vinetrail Black Hat Subset — Test Plan & 檔案清單

| 欄位 | 值 |
|------|-----|
| **Checkpoint** | **2026-09-25 PM HKT** · 承接 [`0925_lunch_grok_zh.md`](./0925_lunch_grok_zh.md) §3 缺口 |
| 分類 | **內部 OpSec Only · 禁止對外原文發布** |
| SKU | `@vinetrail/vinetrail-solana` · Home Chain **4663** |
| 分支 / HEAD | `main` @ **`9376f67`**（起草時） |
| Judge bar（現） | **14 files · 54 `it`** + `pnpm demo:solana-sentinel` |
| Judge bar（目標） | **CLOSED @ PR-A + PR-B**（+5 files · +26 `it` from 28） |
| 原 Black Hat（prune 前） | security 4 + chaos 5 + defense 15 + p0 31 cases — **不恢復全量** |

> **定位：** 只補 **solana SKU 決策層** adversarial 覆蓋；**不**恢復 flagship Worker RPC defense · GMX/Pendle chaos · 全 p0 corpus。

---

## 0. 執行摘要

| 決策 | 裁決 |
|------|------|
| Hackathon judge | 現 28/28 **已足** — subset **非阻 judge** |
| npm publish / OpSec | subset **建議 P1** — 填 lunch §3 披露缺口 |
| 全量 Black Hat 24 `it` | **不恢復** — 已归档历史 monorepo（非当前三 SKU 仓） |
| Rust `nested_decode.rs` | **不納 Vitest** — 保持 `cargo test` 獨立 |

---

## 1. 範圍（In / Out）

### 1.1 In scope（本 plan）

| 向量 | 現缺口 | 新測試檔 |
|------|--------|----------|
| SDK export 無 secret | 無 automated audit | `tests/security/sdk-export-surface.test.ts` |
| venue drift | 僅 demo S2 | `tests/core/venue-drift-mandate.test.ts` |
| intent digest / attempt budget | 無 unit | `tests/core/intent-mandate-adversarial.test.ts` |
| RH toxic corpus（精簡） | p0 16 cases 未 replay | `tests/adversarial/vinetrail-toxic-corpus.test.ts` |
| signing severance 鏈 | 僅 1 case（Pons） | `tests/core/signing-channel-severance.test.ts` |

### 1.2 Out of scope（明確不建）

| 項目 | 原因 |
|------|------|
| `tests/defense/rpc-whitelist.test.ts` | 依賴 `src/services/defense/`（已 prune） |
| `tests/chaos/orbit-agentic-failclosed-chaos.test.ts` | GMX/Pendle/session-key monorepo 依賴 |
| p0 全 31 cases | 過重；只取 RH-relevant **10 cases** |
| `SESSION_KEY_EXPIRED` runtime | SKU 僅 type stub，無可測 hook |
| Cloudflare Worker / KV / grant-audit HTTP | 非 Vinetrail SKU |
| Stylus TS parity chaos | 留 Rust；不加 TS mirror |

---

## 2. 檔案清單（新增 / 修改）

### 2.1 新增檔案（7）

| # | 路徑 | 類型 | `it` 數 | 行數預算 |
|---|------|------|---------|----------|
| 1 | `tests/security/sdk-export-surface.test.ts` | Vitest | **5** | ≤120 |
| 2 | `tests/core/venue-drift-mandate.test.ts` | Vitest | **4** | ≤100 |
| 3 | `tests/core/intent-mandate-adversarial.test.ts` | Vitest | **4** | ≤120 |
| 4 | `tests/core/signing-channel-severance.test.ts` | Vitest | **3** | ≤90 |
| 5 | `tests/adversarial/vinetrail-toxic-corpus.test.ts` | Vitest | **10** | ≤150 |
| 6 | `tests/adversarial/fixtures/toxic-corpus-rh.json` | Fixture | — | ≤80 lines JSON |
| 7 | `tests/adversarial/helpers/corpus-runner.ts` | Helper | — | ≤80 |

### 2.2 修改檔案（3）

| 路徑 | 變更 |
|------|------|
| `vitest.config.ts` | `VINETRAIL_UNIT_GLOBS` 加入 4 個新 `.test.ts` |
| `package.json` | `test` script 顯式列 13 paths |
| `docs/Internal/0925_lunch_grok_zh.md` | §3 加連結 · 缺口 CLOSED 標記（實作後） |

### 2.3 不修改（對外 SSOT 可選後續）

| 路徑 | 備註 |
|------|------|
| `README.md` / `JUDGE_BRIEF.md` | 實作 + CI 綠後再改 test count（28→44） |
| `SECURITY.md` | 可加一句「adversarial subset in CI」— P2 |

---

## 3. 測試案例明細

### 3.1 `tests/security/sdk-export-surface.test.ts`（5 `it`）

取代已刪 `security-audit.test.ts` 的 **Vinetrail 子集**。

| `it` | 斷言 |
|----|------|
| barrel 只 export 預期符號 | `import * as sdk from "../../src/sdk"` — keys ⊆ allowlist |
| 無 `privateKey` / `mnemonic` / `SECRET` 字串 export | 靜態掃 `src/sdk.ts` re-export 鏈 |
| `EXOMESH_SESSION_KEY_STUB` 不在 public barrel | 僅 internal `agent-exomesh-guard-types` |
| `guardAgentUserOp` reject 不寫入鏈上狀態 | mock：無 fetch / 無 env secret 讀取 |
| `readStateOverride` 在 test 後可 reset | 配合 `writeStateOverride(null)` hygiene |

**Allowlist（預期 export）：**  
`solana_*` constants · `assertUnidirectionalBridge` · `buildsolanaAuditSnapshot` · `VinetrailGuard` · `VinetrailPreSignGate` · `guardAgentUserOp` · `evaluateAgentExoMeshGuard` · `checkSoilResistance`

---

### 3.2 `tests/core/venue-drift-mandate.test.ts`（4 `it`）

對齊 demo Scenario 2 · `evaluateIntentMandateGate` / `checkSoilResistance`。

| `it` | 輸入 | 預期 |
|----|------|------|
| `unauthorized_hook_dex` 被拒 | `targetVenue: unauthorized_hook_dex` · RH whitelist | `VENUE_DRIFT_REJECTED` · `signingChannelOpen=false` |
| `usd_vault` 在白名單內通過 | `venueKey: usd_vault` | `ok: true` |
| `targetVenue` 缺省但 `venueKey` toxic | 同 demo `RH_TOXIC_VENUE` | tripped |
| inbound AML 與 venue 獨立 | bridge `42161→4663` | `AML_INBOUND_TO_solana_BLOCKED`（回歸，防耦合） |

**Fixture 常數（與 demo 一致）：**

```ts
const RH_ALLOWED = ["uniswap_v4", "pons_launchpad", "usd_vault"] as const;
const RH_TOXIC = "unauthorized_hook_dex";
const CHAIN = 4663;
```

---

### 3.3 `tests/core/intent-mandate-adversarial.test.ts`（4 `it`）

| `it` | 向量 | 預期 |
|----|------|------|
| digest mismatch fail-closed | 錯 `intentDigest` vs `buildIntentDigest()` | `INTENT_DIGEST_MISMATCH` |
| attempt budget 超限 sever | 同一 `agentId` 重複 N+1 次 | `MAX_ATTEMPTS_EXCEEDED_SEVERED` |
| digest 正確時通過 | 匹配 digest + allowed venue | `ok: true` |
| `__resetIntentAttemptTrackerForTests` 清槽 | beforeEach 調用 | 測試隔離 |

---

### 3.4 `tests/core/signing-channel-severance.test.ts`（3 `it`）

| `it` | 觸發 | 預期 |
|----|------|------|
| soil slippage trip → sever | cross-venue breach | `readStateOverride()?.signingChannelOpen === false` |
| mandate trip → sever | venue drift | 同上 |
| `writeStateOverride(null)` 重置 | afterEach | channel 恢復 open（或 null） |

---

### 3.5 `tests/adversarial/vinetrail-toxic-corpus.test.ts`（10 `it`）

JSON-driven；每 case 映射到 **單一 SDK 入口**（`evaluateGatewayRules` · `guardAgentUserOp` · `validateAcrossBridgeDirection`）。

**Fixture：** `tests/adversarial/fixtures/toxic-corpus-rh.json`

| case id | 原 p0 類別 | 入口 | 預期 |
|---------|------------|------|------|
| `rh-toxic-01` | cross-venue slippage | `guardAgentUserOp` | `allowed: false` |
| `rh-toxic-02` | depth collapse | `checkSoilResistance` | `tripped: true` |
| `rh-toxic-03` | `payloadPoison` | `evaluateGatewayRules` | `failClosed: true` |
| `rh-toxic-04` | inbound `42161→4663` | `validateAcrossBridgeDirection` | `inboundBlocked` |
| `rh-toxic-05` | omni dest `4663→10` | `validateAcrossBridgeDirection` | `BRIDGE_ROUTE_UNSUPPORTED` |
| `rh-toxic-06` | venue drift | `checkSoilResistance` | `VENUE_DRIFT_REJECTED` |
| `rh-toxic-07` | bridge timeout | `evaluateBridgeTimeout` | `BRIDGE_TIMEOUT_FAIL_CLOSED` |
| `rh-toxic-08` | treasury misuse vector | `quoteRChainYieldToArbitrumGm` | `ok: false` 或 `bridgeEscortOk: false` |
| `rh-toxic-09` | max slippage 1bps breach | `evaluateAgentExoMeshGuard` | `deadmanTriggered` |
| `rh-toxic-10` | healthy control | `guardAgentUserOp` | `allowed: true` |

**JSON schema（每 entry）：**

```json
{
  "id": "rh-toxic-01",
  "entry": "guardAgentUserOp",
  "input": { "intent": {}, "soil": {} },
  "expect": { "allowed": false }
}
```

---

## 4. Vitest 註冊（實作時）

`vitest.config.ts` 追加：

```ts
"tests/security/sdk-export-surface.test.ts",
"tests/core/venue-drift-mandate.test.ts",
"tests/core/intent-mandate-adversarial.test.ts",
"tests/core/signing-channel-severance.test.ts",
"tests/adversarial/vinetrail-toxic-corpus.test.ts",
```

**驗證命令：**

```bash
pnpm test                    # 目標：13 files · ~44 PASS
npx vitest run tests/security/sdk-export-surface.test.ts   # 增量開發
DEMO_AUTO=1 pnpm demo:solana-sentinel                   # 回歸不變
```

---

## 5. 實作順序（建議 2 PR）

### PR-A — OpSec 快赢（~12 `it`）

1. `sdk-export-surface.test.ts`
2. `venue-drift-mandate.test.ts`
3. `signing-channel-severance.test.ts`

**交付：** 12 files · ~40 PASS · 填 lunch §3 venue + export 缺口

### PR-B — Corpus harness（~10 `it`）

1. `toxic-corpus-rh.json` + `corpus-runner.ts`
2. `vinetrail-toxic-corpus.test.ts`
3. `intent-mandate-adversarial.test.ts`

**交付：** 13 files · ~44 PASS · 可對外稱「RH adversarial subset locked」

---

## 6. 缺口關閉對照（實作後）

| lunch §3 缺口 | PR | 狀態（起草時） |
|---------------|-----|----------------|
| p0 toxic 未 replay | PR-B · `toxic-corpus-rh` 10 cases | **CLOSED** |
| intent digest / attempt budget | PR-B · `intent-mandate-adversarial` 4 `it` | **CLOSED** |
| session expiry 無 unit | — | **DEFER**（SKU 無 runtime） |
| venue drift 無 unit | PR-A | **CLOSED** |
| SDK export 無 audit | PR-A | **CLOSED** |
| RPC honeypot | — | **OUT OF SCOPE** |
| Stylus nested TLV Vitest | — | **OUT OF SCOPE**（Rust only） |

---

## 7. 對外敘事（實作後才可說）

| ✅ 可說 | ❌ 不可說 |
|--------|----------|
| Vinetrail adversarial subset · 13 files · ~44 PASS | Black Hat 全綠 · 1156 tests |
| venue drift + export surface CI locked | security-audit 原 4 `it` 全恢復 |
| RH toxic corpus 10 cases replay | p0 31 cases 全覆蓋 |

---

*內部文件 · SilverVine Labs OpSec · DO NOT PUBLISH · Draft @ 2026-09-25 PM HKT*
