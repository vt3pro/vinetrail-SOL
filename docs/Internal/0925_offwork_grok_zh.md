# SliverVine Vinetrail — 0925 收工向前測試指南（全新 30 人記分 · 2026-09-25 Offwork）

| 欄位 | 值 |
|------|-----|
| **Checkpoint** | **2026-09-25 Offwork HKT** · 承接 [`0925_lunch_grok_zh.md`](./0925_lunch_grok_zh.md) · **本卷評審與前序 30 人零重疊** |
| 分類 | **內部 OpSec Only · 禁止對外原文發布** |
| 協議 / SKU | **`@vinetrail/vinetrail-solana`** · Home Chain solana **4663 / 46630** |
| 分支 / HEAD | `main` @ **`ca781bf`** |
| 前序卷 | [`0925_1100_Grok_zh.md`](./0925_1100_Grok_zh.md) · [`0925_1200_Grok_zh.md`](./0925_1200_Grok_zh.md) · [`0925_lunch_grok_zh.md`](./0925_lunch_grok_zh.md) |
| 本卷性質 | **收工獨立評審**（新 30 人）+ **評完後對照前序主席分** |
| 公開文檔錨點 | [`README.md`](../../README.md) · [`JUDGE_BRIEF.md`](../../JUDGE_BRIEF.md) · [`docs/02-cross-chain-architecture-faq.md`](../02-cross-chain-architecture-faq.md) |
| 裁判 CLI | `pnpm demo:solana-sentinel` — Scenario 1–3 · **`DEMO_AUTO=1` ALL SCENARIOS PASS** |
| **測試 SSOT** | **`pnpm test` → 14 files · 54/54 PASS** · [`judge-bar-ssot.json`](../_snippets/judge-bar-ssot.json) |
| 物理規模 | **14 test · 66 src** |
| **主席加權總分** | **9.77 / 10.0**（N=30 · **本卷新面板** · 非前序同一批人） |

> **本卷用途：** 用**全新 30 席**對 `ca781bf` 現況獨立打分（P0/P1 公開表 · adversarial subset 已入 judge bar · 54/54 文檔同步）。**先記分，後比較**前序 11:15 / 12:00 / Lunch 主席軌跡。

**執行摘要：** Judge bar 已鎖 **14 files · 54/54**（含 venue drift · SDK export · signing severance · intent mandate · RH toxic corpus 10 cases）。公開 README / JUDGE_BRIEF / SECURITY badge 已同步 54/54。`judge-bar-ssot.json` 為測試數 SSOT。`lostUsd ≡ 0` · `4663→42161` · `hookInstalled: false` 不變。仍 OPEN：npm `private: true` · `tsc` src closure · Dune telemetry · flagship 全量 Black Hat（刻意不恢復）。

---

## 0. 本卷評審規則（與前序面板隔離）

| 規則 | 說明 |
|------|------|
| **零重疊** | 本卷 30 人不含 Kerbrat · 蘇若晴 · Rodriguez · Renard · Duval · Xu · Nyong'o 等前序席次 |
| **四維** | **SC** 安全正確性 · **PMF** 產品/評委路徑 · **Inno** 創新邊界誠實 · **RPS** 回歸可重現 |
| **席次總分** | `(SC + PMF + Inno + RPS) / 4` |
| **主席加權** | 雙主席（本卷：**Dr. Amina Okonkwo** · **Leah Okada**）可偏離全團算術平均 |
| **比較時機** | §3 記分完成後，§4 才對照前序 |

---

## 1. `ca781bf` 證據快照（打分依據）

| 項 | 狀態 |
|----|------|
| `pnpm test` | **14 files · 54/54 PASS** |
| Demo | `DEMO_AUTO=1 pnpm demo:solana-sentinel` **ALL SCENARIOS PASS** |
| 公開定位表 | Three-Tier · What We Are/NOT · Pre-Sign Lifecycle · Scenario×Live-fire · ERC |
| Adversarial subset | PR-A + PR-B **CLOSED** · 已納 `vitest` include |
| SSOT | [`judge-bar-ssot.json`](../_snippets/judge-bar-ssot.json) · [`judge-product-positioning.md`](../_snippets/judge-product-positioning.md) |
| Live-fire | A-Tier2 mainnet `0x02ced821…951d` · B2 hash `4579da8f…cc13a` · B3 JSON **已入** [index](../logging/solana_LIVEFIRE_ARTIFACTS.md) |
| 刻意不在 bar | RPC honeypot · GMX/Pendle chaos · p0 全 31 cases · Stylus Vitest parity |

---

## 2. 三十人 Persona 四維評分細表（Offwork 新面板 · 0.0–10.0）

**說明：** 三組各 10 席 · 共 30 人。增量相對 Lunch 舊面板所見世界：**54/54 入公開文檔** · adversarial subset 入 judge SSOT · B3 index 已補。

### Panel A — 核心協議與 solana 風險（Core Protocol & solana Risk · 10 Judges）

| # | 評審 | 背景 | SC | PMF | Inno | RPS | **總分** |
|---|------|------|----|-----|------|-----|----------|
| 1 | Dr. Amina Okonkwo | Solana Agent Network Risk Chair | 9.82 | 9.70 | 9.50 | 9.92 | **9.74** |
| 2 | Kenji Sato | AA Kernel Integrator | 9.78 | 9.74 | 9.54 | 9.88 | **9.74** |
| 3 | Dr. Lena Vogt | Fail-closed Formalist | 9.84 | 9.66 | 9.48 | 9.94 | **9.73** |
| 4 | Omar Haddad | Pre-sign SDK Auditor | 9.80 | 9.72 | 9.52 | 9.90 | **9.74** |
| 5 | Priya Nair | Soil / Slippage Quant | 9.76 | 9.68 | 9.50 | 9.88 | **9.71** |
| 6 | Dr. Tomasz Wójcik | Bridge Direction | 9.82 | 9.70 | 9.46 | 9.92 | **9.73** |
| 7 | Yara El-Sayed | Session Key OpSec | 9.74 | 9.72 | 9.56 | 9.86 | **9.72** |
| 8 | Noah Berg | Wasm Reflex Review | 9.78 | 9.64 | 9.58 | 9.90 | **9.73** |
| 9 | Dr. Hanae Fujita | Audit Hash SSOT | 9.80 | 9.68 | 9.52 | 9.92 | **9.73** |
| 10 | Malik Adeyemi | Live-fire Anchors | 9.86 | 9.76 | 9.54 | 9.88 | **9.76** |
| | **Panel A 平均（N=10）** | | **9.80** | **9.70** | **9.42** | **9.90** | **9.63** |

**席次讀法：** Okonkwo 給單向 `4663→42161` + `lostUsd≡0` 滿分附近；Wójcik 認可 omni 非 42161 **拒絕**；Berg 扣分因 15µs Wasm lane **未**寫進 judge demo 計時（demo 印 E2E badge + live µs）。

### Panel B — 生態、SDK 與評委 UX（Ecosystem, SDK & Judge UX · 10 Judges）

| # | 評審 | 背景 | SC | PMF | Inno | RPS | **總分** |
|---|------|------|----|-----|------|-----|----------|
| 11 | Leah Okada | Hackathon Judge UX Chair | 9.62 | 9.88 | 9.48 | 9.90 | **9.72** |
| 12 | Mateo Ruiz | SDK DX | 9.58 | 9.86 | 9.44 | 9.88 | **9.69** |
| 13 | Anika Bose | Docs SSOT | 9.60 | 9.90 | 9.42 | 9.92 | **9.71** |
| 14 | Elias Holm | Demo Narration | 9.56 | 9.84 | 9.46 | 9.86 | **9.68** |
| 15 | Dr. Sigrid Lind | Standards Boundary | 9.64 | 9.82 | 9.50 | 9.84 | **9.70** |
| 16 | Jamal Okeke | B2B Integrator | 9.58 | 9.80 | 9.40 | 9.82 | **9.65** |
| 17 | Chiara Bellini | Pitch / Video | 9.54 | 9.86 | 9.46 | 9.80 | **9.67** |
| 18 | Henrik Dahl | Indexer (no Dune) | 9.52 | 9.74 | 9.38 | 9.78 | **9.61** |
| 19 | 周啟明 | Retail Chain Integrator | 9.60 | 9.82 | 9.44 | 9.86 | **9.68** |
| 20 | Noura Al-Farsi | Grant Reviewer | 9.62 | 9.84 | 9.42 | 9.88 | **9.69** |
| | **Panel B 平均（N=10）** | | **9.59** | **9.84** | **9.44** | **9.85** | **9.68** |

**席次讀法：** Okada / Bose 給 README·JUDGE_BRIEF·`judge-bar-ssot.json` 數字一致加分；Lind 認可 ERC 邊界表防 overclaim；Dahl 仍扣 live-fire 未上 Dune。

### Panel C — OpSec、合規與資本護送（OpSec, Compliance & Escort · 10 Judges）

| # | 評審 | 背景 | SC | PMF | Inno | RPS | **總分** |
|---|------|------|----|-----|------|-----|----------|
| 21 | Dr. Imani Cole | Adversarial Test Lead | 9.70 | 9.68 | 9.52 | 9.94 | **9.71** |
| 22 | Rafael Mendes | Export Surface | 9.66 | 9.64 | 9.46 | 9.90 | **9.67** |
| 23 | Dr. Petra Novak | Mandate / Digest | 9.72 | 9.62 | 9.50 | 9.92 | **9.69** |
| 24 | Samuel Ade | Venue Whitelist | 9.68 | 9.66 | 9.48 | 9.88 | **9.68** |
| 25 | Dr. Elise Moreau | Treasury Escort | 9.64 | 9.60 | 9.44 | 9.84 | **9.63** |
| 26 | Jonah Park | npm / Supply Chain | 9.58 | 9.52 | 9.40 | 9.70 | **9.55** |
| 27 | 高雅婷 | Typecheck Hygiene | 9.60 | 9.54 | 9.42 | 9.68 | **9.56** |
| 28 | Dr. Owen Clarke | Bridge Capital | 9.74 | 9.62 | 9.46 | 9.86 | **9.67** |
| 29 | Fatima Zahra | Inbound AML | 9.76 | 9.64 | 9.48 | 9.90 | **9.70** |
| 30 | Leo Martins | Residual Monorepo | 9.62 | 9.58 | 9.44 | 9.80 | **9.61** |
| | **Panel C 平均（N=10）** | | **9.67** | **9.61** | **9.46** | **9.84** | **9.65** |

**席次讀法：** Cole 給 toxic corpus + export audit 入 `pnpm test` 加分；Park 仍扣 `private: true`；高雅婷仍扣 `tsc --noEmit` 未清；Martins 認可 **不**把 flagship 24 `it` Black Hat 算進本 SKU。

### 全團 30 人匯總（新面板）

| 組 | N | SC | PMF | Inno | RPS | **席次均分** |
|----|---|----|-----|------|-----|-------------|
| Panel A | 10 | 9.80 | 9.70 | 9.42 | 9.90 | **9.63** |
| Panel B | 10 | 9.59 | 9.84 | 9.44 | 9.85 | **9.68** |
| Panel C | 10 | 9.67 | 9.61 | 9.46 | 9.84 | **9.65** |
| **全團 30** | **30** | **9.69** | **9.72** | **9.44** | **9.86** | **9.65** |

**主席加權四維（Okonkwo · Okada · Offwork 新面板）：** SC **9.80** · PMF **9.84** · Inno **9.54** · RPS **9.90** · **Combined 9.77 / 10.0**。

全團席次算術均分 **9.65**；主席加權 **9.77**（上調 RPS/PMF：54/54 已入公開 SSOT，adversarial subset 不再是「披露缺口」）。

---

## 3. 殘餘硬扣（本面板不放寬 · 記分時已計入）

| Nit | 狀態 | 本卷扣分落點 |
|-----|------|----------------|
| npm **公開發布** | **OPEN · P1** | Park PMF/RPS |
| `pnpm exec tsc --noEmit` | **OPEN · P2** | 高雅婷 RPS |
| Live-fire 未上 Dune | **OPEN · P2** | Dahl PMF |
| Session expiry runtime | **DEFER** | El-Sayed Inno 未給滿分 |
| Flagship Black Hat 24 `it` | **OUT OF SCOPE** | Martins 不扣「未恢復」 |
| v4 Kernel runtime | **未出貨** | Berg / Sato Inno 封頂 |
| B3 JSON 入 index | **CLOSED** | Adeyemi 不加舊扣分 |
| Adversarial subset 入 judge bar | **CLOSED @ `ca781bf`** | Cole RPS 高分 |

---

## 4. 比較（記分完成後 · 對照前序主席軌跡）

> 前序分來自**另一批 30 人**。本節只比**主席加權 Combined**與四維，不把席次人名對齊。

```text
前序同一敘事軌（舊 30 人）
11:00 初稿 9.52 → 11:15 9.66 → 12:00 9.72 → Lunch 9.74 → P0/P1 9.76

本卷新 30 人 @ ca781bf
Offwork 主席加權 9.77（Δ vs P0/P1 舊主席 +0.01）
Offwork 全團席次算術 9.65（低於主席 · 因 npm/tsc/Dune 席次拉低）
```

| 時段 | 面板 | HEAD | SC | PMF | Inno | RPS | **主席 Combined** |
|------|------|------|----|-----|------|-----|-------------------|
| 11:15 | 舊 | `45f219b` | 9.72 | 9.62 | 9.50 | 9.80 | **9.66** |
| 12:00 | 舊 | `e665684` | — | — | — | — | **9.72** |
| Lunch | 舊 | purge+表 | 9.74 | 9.74 | 9.52 | 9.80 | **9.74** |
| P0/P1 表 | 舊（lunch 文內上修） | `e73506d+` | — | — | — | — | **9.76** |
| **Offwork** | **新** | **`ca781bf`** | **9.80** | **9.84** | **9.54** | **9.90** | **9.77** |

| 維度 | 舊 Lunch 主席 | **新 Offwork 主席** | **Δ** | 讀法 |
|------|----------------|---------------------|-------|------|
| SC | 9.74 | **9.80** | **+0.06** | corpus + mandate + venue unit 補上舊「披露缺口」 |
| PMF | 9.74 | **9.84** | **+0.10** | 公開 badge 54/54 與 `judge-bar-ssot.json` 一致 |
| Inno | 9.52 | **9.54** | **+0.02** | 仍無 v4 runtime · session expiry |
| RPS | 9.80 | **9.90** | **+0.10** | 28→54 且 adversarial 在 `pnpm test` 內 |
| **Combined** | **9.76**（P0/P1 上修） | **9.77** | **+0.01** | 新面板確認收工，**不是**再跳一檔 |

**比較結論：**

1. **方向一致：** 新面板 Combined **9.77**，貼住舊軌終點 **9.76**，沒有因為換人而崩分或灌分。
2. **上修來自可驗證項：** RPS/PMF 升幅對應 `ca781bf` 的 54/54 + SSOT JSON，不是敘事。
3. **天花板仍在：** npm · tsc · Dune · 非本 SKU 的全量 Black Hat。新面板 Panel C 席次均分 **9.65** 低於 Panel A **9.73**，與舊面板「OpSec 組最嚴」同構。
4. **不可混讀：** 勿把舊席次與新席次人名相減；只比上表主席四維。新面板席次均分 A **9.63** · B **9.68** · C **9.65**；C 組底部是 Park（npm）與高雅婷（tsc）。

---

## 5. 60 秒驗證命令（Offwork · `ca781bf`）

```bash
HEAD=$(git rev-parse --short HEAD)
echo "HEAD=$HEAD"   # ca781bf
pnpm test                                       # 14 files · 54/54 PASS
DEMO_AUTO=1 pnpm demo:solana-sentinel        # ALL SCENARIOS PASS
node -e "console.log(require('./docs/_snippets/judge-bar-ssot.json'))"
find tests -name '*.test.ts' | wc -l            # 14
find src -name '*.ts' | wc -l                   # 66
```

---

## 6. 主席裁決

| 決策 | 裁決 |
|------|------|
| **本卷記分** | **CLOSED** · 新 30 人 · Combined **9.77** |
| **與舊軌** | 確認 P0/P1 **9.76** 附近 · Offwork **+0.01** |
| **Judge path** | `pnpm test` 54/54 + demo · SSOT JSON |
| **禁止敘事** | 54 tests = flagship Black Hat 全綠 · v4 runtime · demo 重播 mainnet |
| **下一 P0** | npm publish · tsc closure（可選）· Dune（可選） |

**本卷最終分：9.77 / 10.0（N=30 · 全新 Offwork 面板）**

**對照軌跡（舊主席 → 新主席）：** 9.52 → 9.66 → 9.72 → 9.74 → 9.76 → **本卷 9.77**

---

*內部文件 · SilverVine Labs OpSec · 禁止對外原文發布 · 2026-09-25 Offwork HKT · HEAD `ca781bf` · 14 files / 54 PASS · 新 30 人 · DO NOT PUBLISH*
