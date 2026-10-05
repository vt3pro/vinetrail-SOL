/** Pre-broadcast guard latency — local SSOT for Colosseum claims (not CI). */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Keypair, SystemProgram, Transaction, VersionedTransaction } from "@solana/web3.js";
import { guardJitoBundlePreBroadcast } from "../src/adapters/solana/solana-jito-bundle-guard";
import { guardSolanaPreBroadcast } from "../src/adapters/solanaAgentAdapter";
import { HEALTHY_SOLANA_SOIL } from "../tests/helpers/solana-soil-fixtures";

const PAYER = Keypair.fromSeed(new Uint8Array(32).fill(7));
const BLOCKHASH = "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTkmh1";
const WARMUP = 500;
const SAMPLES = 10_000;

function buildVtx(): VersionedTransaction {
  const to = Keypair.fromSeed(new Uint8Array(32).fill(9)).publicKey;
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: PAYER.publicKey,
      toPubkey: to,
      lamports: 1_000,
    }),
  );
  tx.feePayer = PAYER.publicKey;
  tx.recentBlockhash = BLOCKHASH;
  tx.sign(PAYER);
  return new VersionedTransaction(tx.compileMessage());
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

function benchSingle(vtx: VersionedTransaction, soil: typeof HEALTHY_SOLANA_SOIL): number[] {
  for (let i = 0; i < WARMUP; i++) {
    guardSolanaPreBroadcast({ transaction: vtx, soil });
  }
  const times: number[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const t0 = performance.now();
    guardSolanaPreBroadcast({ transaction: vtx, soil });
    times.push(performance.now() - t0);
  }
  times.sort((a, b) => a - b);
  return times;
}

function benchBundle(vtx: VersionedTransaction, soil: typeof HEALTHY_SOLANA_SOIL): number {
  const txs = [vtx, vtx, vtx] as const;
  for (let i = 0; i < WARMUP; i++) {
    guardJitoBundlePreBroadcast({ transactions: txs, soil });
  }
  const t0 = performance.now();
  for (let i = 0; i < SAMPLES; i++) {
    guardJitoBundlePreBroadcast({ transactions: txs, soil });
  }
  return (performance.now() - t0) / SAMPLES;
}

const vtx = buildVtx();
const soil = HEALTHY_SOLANA_SOIL;
const single = benchSingle(vtx, soil);
const bundleAvgMs = benchBundle(vtx, soil);

const p50 = percentile(single, 50);
const p95 = percentile(single, 95);
const p99 = percentile(single, 99);

const lines = [
  "# Pre-Broadcast Guard Latency (local snapshot)",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Command: `pnpm run bench:guard`",
  "",
  "Environment: host Node.js (`performance.now()`). Not a production Jito/edge claim.",
  "",
  "## `guardSolanaPreBroadcast` (single VersionedTransaction)",
  "",
  `| Samples | ${SAMPLES} |`,
  `| p50 | ${p50.toFixed(4)} ms |`,
  `| p95 | ${p95.toFixed(4)} ms |`,
  `| p99 | ${p99.toFixed(4)} ms |`,
  "",
  "## `guardJitoBundlePreBroadcast` (3 txs, mean per bundle call)",
  "",
  `| Mean | ${bundleAvgMs.toFixed(4)} ms |`,
  "",
];

const outPath = join(process.cwd(), "docs/submission/BENCHMARK.md");
writeFileSync(outPath, lines.join("\n") + "\n", "utf8");

console.log(lines.join("\n"));
console.log(`\nWrote ${outPath}`);
