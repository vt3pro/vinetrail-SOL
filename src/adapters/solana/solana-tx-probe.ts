/** Solana tx structural probe — pre-broadcast metadata only (no amount inference). */
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  VersionedTransaction,
} from "@solana/web3.js";

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

export interface SolanaTxProbe {
  ixCount: number;
  accountKeysLen: number;
  totalDataLen: number;
  writableSignerCount: number;
  programIds: string[];
  unknownProgram: boolean;
}

function isKnownProgram(id: PublicKey): boolean {
  return id.equals(SystemProgram.programId) || id.equals(TOKEN_PROGRAM_ID);
}

function probeInstructions(ixs: readonly TransactionInstruction[]): SolanaTxProbe {
  const programIds: string[] = [];
  let totalDataLen = 0;
  let unknownProgram = false;
  for (const ix of ixs) {
    programIds.push(ix.programId.toBase58());
    totalDataLen += ix.data.length;
    if (!isKnownProgram(ix.programId)) unknownProgram = true;
  }
  return {
    ixCount: ixs.length,
    accountKeysLen: 0,
    totalDataLen,
    writableSignerCount: 0,
    programIds,
    unknownProgram,
  };
}

export function probeVersionedTransaction(tx: VersionedTransaction): SolanaTxProbe | null {
  const message = tx.message;
  const keys = message.staticAccountKeys;
  const compiled = message.compiledInstructions;
  if (compiled.length === 0) return null;

  const programIds: string[] = [];
  let totalDataLen = 0;
  let unknownProgram = false;
  for (const ix of compiled) {
    const pid = keys[ix.programIdIndex];
    if (!pid) continue;
    programIds.push(pid.toBase58());
    totalDataLen += ix.data.length;
    if (!isKnownProgram(pid)) unknownProgram = true;
  }

  const header = message.header;
  return {
    ixCount: compiled.length,
    accountKeysLen: keys.length,
    totalDataLen,
    writableSignerCount: header.numRequiredSignatures,
    programIds,
    unknownProgram,
  };
}

export function probeInstructionsOnly(ixs: readonly TransactionInstruction[]): SolanaTxProbe {
  const base = probeInstructions(ixs);
  return { ...base, accountKeysLen: ixs.reduce((n, ix) => n + ix.keys.length, 0) };
}
