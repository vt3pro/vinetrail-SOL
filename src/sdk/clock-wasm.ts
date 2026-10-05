/** SKU stub — clock Wasm not bundled; monotonic-time uses host JS fallback. */
export function ensureClockWasm(): boolean {
  return false;
}

export function isClockWasmReady(): boolean {
  return false;
}

export function allocClockWasmHeap(): null {
  return null;
}

export function clockWasmRead(): { virtualWallMs: number; anomalyCode: number } {
  return { virtualWallMs: 0, anomalyCode: 0 };
}

export function clockWasmPackState(): Float64Array {
  return new Float64Array(3);
}

export function clockWasmSaturatingSub(a: number, b: number): number {
  return a > b ? a - b : 0;
}

export function clockWasmResolveWallAge(
  nowMs: number,
  timestampMs: number,
): { kind: "OK"; ageMs: number } | { kind: "LEAP"; deltaMs: number } {
  const delta = nowMs - timestampMs;
  return delta < 0 ? { kind: "LEAP", deltaMs: delta } : { kind: "OK", ageMs: delta };
}

export function clockWasmRpcIngest(): bigint {
  return 0n;
}
