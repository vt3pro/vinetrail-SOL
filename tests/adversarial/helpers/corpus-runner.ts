import {
  evaluateAgentExoMeshGuard,
  guardAgentPreSign,
} from "../../../src/core/agent-exomesh-guard";
import { evaluateGatewayRules } from "../../../src/core/risk-engine-gateway-rules";
import { checkSoilResistance } from "../../../src/core/risk-engine-soil";
import type { SoilResistanceInput } from "../../../src/core/soil-resistance-types";

export type CorpusEntryName =
  | "guardAgentPreSign"
  | "checkSoilResistance"
  | "evaluateGatewayRules"
  | "evaluateAgentExoMeshGuard";

export interface CorpusExpect {
  allowed?: boolean;
  tripped?: boolean;
  ok?: boolean;
  failClosed?: boolean;
  deadmanTriggered?: boolean;
  reasonIncludes?: string;
}

export interface CorpusCase {
  id: string;
  entry: CorpusEntryName;
  input: Record<string, unknown>;
  expect: CorpusExpect;
}

function hydrateSoil(raw: Record<string, unknown>): SoilResistanceInput {
  const soil = { ...raw } as SoilResistanceInput & { at?: string | Date };
  if (typeof soil.at === "string") soil.at = new Date(soil.at);
  return soil;
}

export async function runCorpusCase(caseDef: CorpusCase): Promise<Record<string, unknown>> {
  const input = caseDef.input;
  switch (caseDef.entry) {
    case "guardAgentPreSign":
      return await guardAgentPreSign({
        intent: input.intent as Parameters<typeof guardAgentPreSign>[0]["intent"],
        soil: hydrateSoil(input.soil as Record<string, unknown>),
        atMs: input.atMs as number | undefined,
      });
    case "evaluateAgentExoMeshGuard": {
      const verdict = evaluateAgentExoMeshGuard({
        intent: input.intent as Parameters<typeof evaluateAgentExoMeshGuard>[0]["intent"],
        soil: hydrateSoil(input.soil as Record<string, unknown>),
        atMs: input.atMs as number | undefined,
      });
      return {
        allowed: verdict.allowed,
        deadmanTriggered: verdict.rejectPayload?.deadmanTriggered ?? false,
      };
    }
    case "checkSoilResistance":
      return checkSoilResistance(hydrateSoil(input as Record<string, unknown>));
    case "evaluateGatewayRules":
      return evaluateGatewayRules({
        symbol: input.symbol as string,
        payloadPoison: input.payloadPoison as boolean | undefined,
        soil: hydrateSoil(input.soil as Record<string, unknown>),
      });
    default:
      throw new Error(`unsupported corpus entry: ${caseDef.entry}`);
  }
}

export function assertCorpusExpect(
  result: Record<string, unknown>,
  expect: CorpusExpect,
  caseId: string,
): void {
  for (const [key, value] of Object.entries(expect)) {
    if (key === "reasonIncludes") {
      const reasons = (result.reasons as string[] | undefined) ?? [];
      const haystack = reasons.join(" ");
      if (!haystack.includes(value as string)) {
        throw new Error(`${caseId}: expected reason to include ${value}`);
      }
      continue;
    }
    if (result[key] !== value) {
      throw new Error(`${caseId}: expected ${key}=${value} got ${result[key]}`);
    }
  }
}
