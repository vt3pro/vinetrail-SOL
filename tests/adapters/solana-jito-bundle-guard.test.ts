import { Keypair, SystemProgram, Transaction, VersionedTransaction } from "@solana/web3.js";
import { afterEach, describe, expect, it } from "vitest";
import { guardJitoBundlePreBroadcast } from "../../src/adapters/solana/solana-jito-bundle-guard";
import { writeStateOverride } from "../../src/core/state-store";
import { HEALTHY_SOLANA_SOIL } from "../helpers/solana-soil-fixtures";

const PAYER = Keypair.fromSeed(new Uint8Array(32).fill(7));
const BLOCKHASH = "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTkmh1";

afterEach(() => {
  writeStateOverride(null);
});

function buildSystemTransferTx(): VersionedTransaction {
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

function buildEmptySignedVtx(): VersionedTransaction {
  const tx = new Transaction();
  tx.feePayer = PAYER.publicKey;
  tx.recentBlockhash = BLOCKHASH;
  tx.sign(PAYER);
  return new VersionedTransaction(tx.compileMessage());
}

describe("jito bundle pre-broadcast", () => {
  it("allows healthy 2-tx bundle", () => {
    const a = buildSystemTransferTx();
    const b = buildSystemTransferTx();
    const verdict = guardJitoBundlePreBroadcast({
      transactions: [a, b],
      soil: HEALTHY_SOLANA_SOIL,
    });
    expect(verdict.allowed).toBe(true);
    expect(verdict.results).toHaveLength(2);
    expect(verdict.results[0]?.allowed).toBe(true);
    expect(verdict.results[1]?.allowed).toBe(true);
    expect(verdict.failedIndex).toBeNull();
  });

  it("short-circuits on second tx structural poison", () => {
    const healthy = buildSystemTransferTx();
    const poison = buildEmptySignedVtx();
    const verdict = guardJitoBundlePreBroadcast({
      transactions: [healthy, poison],
      soil: HEALTHY_SOLANA_SOIL,
    });
    expect(verdict.allowed).toBe(false);
    expect(verdict.failedIndex).toBe(1);
    expect(verdict.results[0]?.allowed).toBe(true);
    expect(verdict.results[1]?.allowed).toBe(false);
  });
});
