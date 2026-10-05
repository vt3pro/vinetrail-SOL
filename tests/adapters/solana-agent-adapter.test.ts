import { Keypair, SystemProgram, Transaction, VersionedTransaction } from "@solana/web3.js";
import { afterEach, describe, expect, it } from "vitest";
import { guardSolanaPreBroadcast } from "../../src/adapters/solanaAgentAdapter";
import { readStateOverride, writeStateOverride } from "../../src/core/state-store";
import { HEALTHY_SOLANA_SOIL } from "../helpers/solana-soil-fixtures";

const PAYER = Keypair.fromSeed(new Uint8Array(32).fill(7));
const TO = Keypair.fromSeed(new Uint8Array(32).fill(9)).publicKey;
const SYSTEM_TRANSFER_TX = buildSystemTransferTx();

afterEach(() => {
  writeStateOverride(null);
});

function buildSystemTransferTx(): VersionedTransaction {
  const payer = PAYER;
  const to = TO;
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: to,
      lamports: 1_000,
    }),
  );
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTkmh1";
  tx.sign(payer);
  return new VersionedTransaction(tx.compileMessage());
}

describe("solana-agent-adapter pre-broadcast", () => {
  it("allows healthy system transfer + soil", () => {
    const verdict = guardSolanaPreBroadcast({
      transaction: SYSTEM_TRANSFER_TX,
      soil: HEALTHY_SOLANA_SOIL,
    });
    expect(verdict.allowed).toBe(true);
    expect(verdict.probe?.ixCount).toBe(1);
  });

  it("trips toxic soil and severs signing channel", () => {
    const verdict = guardSolanaPreBroadcast({
      transaction: SYSTEM_TRANSFER_TX,
      soil: {
        ...HEALTHY_SOLANA_SOIL,
        pythPriceUsd: 100,
        jupiterDepthUsd: 1_000,
        orcaDepthUsd: 1_000,
        orderSizeUsd: 500,
        maxSlippage: 0.01,
      },
    });
    expect(verdict.allowed).toBe(false);
    expect(readStateOverride()?.signingChannelOpen).toBe(false);
  });

  it("blocks R17 oversized order", () => {
    const verdict = guardSolanaPreBroadcast({
      transaction: SYSTEM_TRANSFER_TX,
      soil: { ...HEALTHY_SOLANA_SOIL, orderSizeUsd: 6_000 },
    });
    expect(verdict.allowed).toBe(false);
    expect(verdict.reasons).toContain("R17_DAILY_LIMIT");
  });
});
