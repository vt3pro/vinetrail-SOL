/** Off-chain audit — repo/venue SSOT: `docs/_snippets/multi-repo-ssot.json`; flags parity: `crates/vinetrail_core`. */

/** Defense matrix R17 — daily / session notional cap (`BIT_R17_DAILY_LIMIT`). */
export const BIT_R17_DAILY_LIMIT = 1 << 16;

/** Defense matrix R20 — deadlock / soil trip severance (`BIT_R20_DEADLOCK`). */
export const BIT_R20_DEADLOCK = 1 << 19;

/** Soil trip flags — `eval.rs` */
export const TRIP_CROSS_VENUE = 1;
export const TRIP_DEPTH = 2;
export const TRIP_INSUFFICIENT = 4;
export const TRIP_PROTOCOL = 8;

export type RiskAuditVenue = "solana" | "hyperliquid" | "tempo";

export interface R17FlagSnapshot {
  tripped: boolean;
  /** Always `BIT_R17_DAILY_LIMIT` (65536) for canonical snapshots. */
  bit: typeof BIT_R17_DAILY_LIMIT;
}

export interface R20FlagSnapshot {
  tripped: boolean;
  /** Always `BIT_R20_DEADLOCK` (524288) for canonical snapshots. */
  bit: typeof BIT_R20_DEADLOCK;
}

export interface SoilResultSnapshot {
  allowed: boolean;
  tripFlags: number;
  defenseBits: number;
}

/** Canonical off-chain real-time risk audit record (see `docs/Internal/MULTI_REPO_OPS_AND_LOGGING_SSOT.md`). */
export interface RiskAuditSnapshot {
  timestamp: string;
  venue: RiskAuditVenue;
  /** SHA-256 hex (64 chars) of canonical input per internal SSOT. */
  inputDigest: string;
  soilResult: SoilResultSnapshot;
  r17Flags: R17FlagSnapshot;
  r20Flags: R20FlagSnapshot;
  executionLatencyNs: number;
  telemetry?: Record<string, string | number | boolean | null>;
  anchor?: {
    kind: "spl_memo" | "hyperliquid_cloid" | "tempo_iso20022";
    payload: string;
  };
}
