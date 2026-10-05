# SliverVine Vinetrail — Pitch Video × Demo Video 分工指南（0925）

| 欄位 | 值 |
|------|-----|
| **Checkpoint** | **2026-09-25** · 承接 [`0925_lunch_grok_zh.md`](./0925_lunch_grok_zh.md) |
| 分類 | **內部 OpSec Only · 禁止對外原文發布** |
| 協議 / SKU | **`@vinetrail/vinetrail-solana`** · Home Chain solana **4663 / 46630** |
| 分支 / HEAD | `main` @ **`e73506d`**（+ P0/P1 judge 表） |
| 公開文檔錨點 | [`README.md`](../../README.md) · [`JUDGE_BRIEF.md`](../../JUDGE_BRIEF.md) · [`02-cross-chain-architecture-faq.md`](../02-cross-chain-architecture-faq.md) · [`solana_LIVEFIRE_ARTIFACTS.md`](../logging/solana_LIVEFIRE_ARTIFACTS.md) |
| 定位表 SSOT | [`docs/_snippets/judge-product-positioning.md`](../_snippets/judge-product-positioning.md) |
| 錄製 SSOT | `pnpm demo:solana-sentinel` · `DEMO_AUTO=1` · `pnpm test`（28/28） |

> **本卷用途：** 定義 **Pitch Video** 與 **Demo Video** 的內容分工、時長、分鏡與禁止敘事。先拍 Demo，再剪 Pitch。

---

## 0. 一句話區分

| | **Pitch Video** | **Demo Video** |
|---|----------------|----------------|
| **目的** | 60–90 秒內讓人**相信問題存在、你們值得看** | 2–4 分鐘內讓人**相信真的做了、可復現** |
| **觀眾** | 評委、投資人、solana / ZeroDev BD | 技術評委、集成方工程師、GitHub 訪客 |
| **情緒** | 「Agent 在 4663 簽錯 = 0 gas 也救不了聲譽」 | 「終端真的 block 了，hash 對得上」 |
| **證據** | 架構圖、痛點、主網锚點**一閃** | 終端錄屏、explorer、JSON **逐帧對照** |

---

## 1. Pitch Video（建議 60–90 秒）

### 1.1 核心任務

賣 **「為什麼」** 和 **「為誰」**，不賣 CLI 細節。

### 1.2 建議結構（按秒）

| 段落 | 秒數 | 內容 |
|------|------|------|
| **Hook** | 0–10 | 「Solana Agent Network 4663 上，AI Agent + Session Key 可在你反應前 sign UserOp。」 |
| **問題** | 10–25 | 權限漂移 · 有毒滑點 · inbound 誤進 4663。公開 README **Three-Tier Architecture** + **Pre-Sign Lifecycle** 圖（勿手畫） |
| **解法** | 25–50 | Vinetrail = **簽之前 fail-closed** 的 Pre-Sign SDK。三詞：**0-Gas Severance** · **4663→42161 · lostUsd≡0** · **SHA-256 合規快照** |
| **可信度** | 50–70 | 只露 **一個** 主網锚點：[0x02ced821…951d](https://explorer.chain.solana.com/tx/0x02ced8215cb1a9f6ec1b82dd39e01536991f278967d63c63dc29bde2ef6d951d)。字幕：**archived live-fire · demo 不重播 broadcast** |
| **收尾** | 70–90 | B2B：`@vinetrail/vinetrail-solana` · ZeroDev Kernel v0.3.1 · **off-chain，不需 Cloudflare**。CTA：「完整復現見 Demo Video」 |

### 1.3 Pitch 刻意不做

- 不錄完整 `pnpm test`
- 不講 `AML_INBOUND_TO_solana_BLOCKED` chain-id predicate 細節
- 不說已部署 bridge / Worker / on-chain hook（`bridgeDeployed: false` · `hookInstalled: false`）
- 不把 v4 readiness 說成 runtime 已切換
- 不把 GMX / HL / Pendle 當核心 venue

### 1.4 視覺建議

- 品牌 logo（`public/brand/logo_vinetrail.jpg`）+ 終端一帧 `[VINETRAIL_BLOCKED]` 紅框
- 動畫：UserOp 在 Sign 前被閘門攔截
- 配樂：緊張 → 解法後轉穩

### 1.5 建議片名

`Vinetrail — Pre-Sign Security for Solana Agent Network (4663)`

---

## 2. Demo Video（建議 2–4 分鐘）

### 2.1 核心任務

賣 **「可驗證」** — 評委 clone 後每一帧都能對上 repo。

### 2.2 建議結構

| 段落 | 時長 | 內容 |
|------|------|------|
| **Intro** | 15s | 口播：**policy replay，不是 live re-broadcast** |
| **Act 1 — Scenario 1** | ~60s | Pre-Sign Gate · 見 §2.3 |
| **Act 2 — Scenario 2** | ~45s | Airlock + Venue Drift · 見 §2.4 |
| **Act 3 — Scenario 3** | ~30s | SHA-256 Audit Certificate · 見 §2.5 |
| **Act 4 — 工程信任層（可選）** | ~30s | `pnpm test` → 28/28 PASS（可剪接 final summary） |
| **Outro** | 15s | README · JUDGE_BRIEF · live-fire index · GitHub |

### 2.3 Act 1 — Scenario 1：Vinetrail Pre-Sign Gate

**錄製命令：**

```bash
DEMO_AUTO=1 pnpm demo:solana-sentinel
# 或交互版：pnpm demo:solana-sentinel（按 Enter 分場）
```

**必須特写：**

- `[VINETRAIL_BLOCKED]` toxic path
- `⚡ 0.107ms (Sub-ms Reflex)` healthy path
- `4663 → 42161` · `lostUsd=0` · `bridgeEscortOk=true`
- Kernel v0.3.1 · EntryPoint 0.7
- 主網 tx **只開 explorer**，強調 **NOT re-broadcast**

### 2.4 Act 2 — Scenario 2：Permissioned Airlock

**必須特写：**

- `unauthorized_hook_dex` ∉ `{uniswap_v4, pons_launchpad, usd_vault}`
- `42161 → 4663` → `AML_INBOUND_TO_solana_BLOCKED`
- 字幕：**decision probe · NOT wallet middleware**

### 2.5 Act 3 — Scenario 3：SHA-256 Audit Certificate

**必須特写：**

- 滾動 `buildsolanaAuditSnapshot()` JSON
- `protocol: "SliverVine-Vinetrail"`
- `inboundBlocked: true` · `sha256Signature` · `lostUsd: 0`
- 可對照 B2 SSOT hash **`4579da8f…cc13a`**

### 2.6 可選補充 — B3 Treasury（~5s）

- JSON：[inbound_treasury 2026-09-25](../logging/solana_livefire_inbound_treasury_2026-09-25T03-37-29-629Z.json)
- `pass: true` · `rpcBroadcastAttempted: false` · `RWA_YIELD_SOURCE_CHAIN_UNSUPPORTED`

### 2.7 錄製技巧

- 終端字號 ≥ 18pt，保留 ANSI 綠/紅
- 優先 `DEMO_AUTO=1` 避免等 Enter 空鏡
- 側邊小窗：solana Explorer 打開 `0x02ced821…951d`
- Demo > 5 分鐘除非最後 1 分鐘是 clone & run，否則過長

### 2.8 建議片名

`Vinetrail Judge Replay — 3 Scenarios · 28/28 PASS`

---

## 2.9 公開文檔錨點（Pitch / Demo 必對齊）

| 公開區塊 | README | JUDGE_BRIEF | Demo 用法 |
|----------|:------:|:-----------:|-----------|
| Three-Tier Architecture | ✅ | ✅ | Pitch 一帧 |
| What We Are / NOT | ✅ | ✅ | Pitch 旁白 |
| Pre-Sign Lifecycle | ✅ | ✅ | Pitch 區分 SDK vs hook |
| Scenario × SDK × Live-fire | ✅ | ✅ | Demo 逐場對照 |
| ERC / Standards | ✅ | ✅ | 口播 footnote |

---

## 3. 內容分工表

| 元素 | Pitch | Demo |
|------|:-----:|:----:|
| 痛點 / PMF | ✅ 主菜 | 一句帶過 |
| 三層架構圖 | ✅ | 可選 10s |
| `demo:solana-sentinel` 三場景 | 各 1 帧 | ✅ 完整 |
| 主網 tx explorer | 1 個鏈接 | 對照展示 |
| `pnpm test` 28/28 | ❌ | ✅ 可選 |
| SDK `VinetrailGuard` snippet | 1 行 | 可不出現 |
| ZeroDev v4 | roadmap 一詞 | readiness 一句 |
| CF Worker / KV | ❌ 明確不需 | ❌ |
| 誠實 footnote 三连 | 内化旁白 | 口播或字幕 |

---

## 4. 誠實三连 Footnote（兩片必帶）

口播或字幕固定出現（避免 overclaim）：

| Flag | 對外說法 |
|------|----------|
| `hookInstalled: false` | Off-chain Pre-Sign SDK；on-chain ERC-7579 hook 在 roadmap |
| `bridgeDeployed: false` | Decision probe · 非 production bridge |
| Demo = policy replay | **不重播** archived live-fire broadcast |

**禁止首屏：** v4 runtime live · Omni 已路由非 42161 · GMX/HL/Pendle 核心 venue · security-audit 仍 PASS · 「1156 全綠」

---

## 5. 製作流程建議

```text
1. 錄 Demo（DEMO_AUTO=1 + explorer 側窗）→ SSOT 素材
2. 跑一遍 pnpm test → 截 28/28 summary（可選）
3. 從 Demo 抽 3 高潮帧 + 旁白 → 剪 Pitch
4. Pitch 上架 landing / 提交表；Demo 鏈到 README · JUDGE_BRIEF
```

**敘事主軸（Pitch）：** 「4663 上的 Session Key / Agent 需要签前闸门」— 優於「又一個 DeFi 協議」。

**技術主軸（Demo）：** [`JUDGE_BRIEF.md`](../../JUDGE_BRIEF.md) 60s 表的可視化版。

---

## 6. Pitch 逐字稿草稿（中文 · ~90 秒）

> 可按語速微調；英文版見 §7。

「在 Solana Agent Network——鏈 ID 4663——AI Agent 和 Session Key 可以在毫秒內簽署 UserOp。問題是：簽出去之後，gas 已經花了，風險已經落地。

我們做 Vinetrail：一個 **簽署之前** 就 fail-closed 的安全 SDK。有毒滑點？攔截。Venue 漂移？攔截。Inbound 資本想從 Arbitrum 溜進 4663？攔截。全部在 **零 gas** 決策層完成——blocked 就不會 broadcast。

出站只有單向護送：4663 到 Arbitrum 42161，`lostUsd` 恒等于零。合規團隊拿到 SHA-256 審計快照，可對照鏈上 live-fire 锚點——但我們的 demo 是 **policy replay**，不會重播那筆主網交易。

Vinetrail 是 off-chain B2B SDK，嵌入 ZeroDev Kernel v0.3.1，不需要 Cloudflare Worker。完整三場景復現，請看 Demo Video，或跑 `pnpm demo:solana-sentinel`。」

---

## 7. Pitch Script Draft（English · ~90s）

「On Solana Agent Network—EVM chain ID 4663—AI agents and session keys can sign UserOps in milliseconds. The problem: once it's signed and broadcast, gas is spent and risk is real.

We built Vinetrail: a **pre-sign**, fail-closed security SDK. Toxic slippage? Blocked. Venue drift? Blocked. Inbound capital trying to enter 4663 from Arbitrum? Blocked. All at the **decision layer—zero gas** on reject.

Outbound is unidirectional escort only: 4663 to Arbitrum 42161, with `lostUsd` locked at zero. Compliance teams get a SHA-256 audit snapshot, anchored to archived mainnet evidence—while our demo is **policy replay**, not a live re-broadcast.

Vinetrail is an off-chain B2B SDK for ZeroDev Kernel v0.3.1—no Cloudflare Worker required. For the full three-scenario replay, watch the Demo Video or run `pnpm demo:solana-sentinel`.」

---

## 8. Demo 分鏡表（Scenario 1–3）

| 镜号 | 画面 | 旁白（可選） | 时长 |
|------|------|--------------|------|
| D0 | 黑屏 + 三词：0-Gas · 4663 · Pre-Sign | policy replay disclaimer | 5s |
| D1 | Banner：Vinetrail for Solana Agent Network | Home chain 4663 / dest 42161 | 5s |
| D2 | Scenario 1 开始 · toxic blocked 红框 | SessionKey drift / toxic flow | 15s |
| D3 | healthy path · 0.107ms · PASS | Sub-ms reflex | 15s |
| D4 | route 4663→42161 · mainnet tx 短 hex | Archived anchor · not re-broadcast | 15s |
| D5 | Scenario 2 · venueDrift=true | unauthorized_hook_dex blocked | 15s |
| D6 | 42161→4663 · AML code | Inbound airlock · not wallet middleware | 15s |
| D7 | Scenario 3 · JSON 滚动 | SHA-256 certificate | 20s |
| D8 | ALL SCENARIOS PASS footer | — | 5s |
| D9 | `pnpm test` summary（可选） | 28/28 PASS | 10s |
| D10 | README + repo URL | — | 5s |

---

## 9. 發布位置建議

| 素材 | 建議位置 |
|------|----------|
| Pitch Video | 提交表 · landing · 社交首帖 |
| Demo Video | README 顶部 · JUDGE_BRIEF · YouTube description → live-fire index |
| 缩略图 | `logo_vinetrail.jpg` + `[VINETRAIL_BLOCKED]` 终端帧 |

---

*內部文件 · SilverVine Labs OpSec · 禁止對外原文發布 · Updated @ 2026-09-25 · HEAD `e73506d` · DO NOT PUBLISH*
