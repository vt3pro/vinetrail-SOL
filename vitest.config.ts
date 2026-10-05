import { defineConfig } from "vitest/config";

// Solana verification bar SSOT — docs/_snippets/judge-bar-ssot.json (10 files · 33 tests)
// Multi-repo naming SSOT — docs/_snippets/multi-repo-ssot.json

const VINETRAIL_UNIT_GLOBS = [
  "tests/adapters/solana-agent-adapter.test.ts",
  "tests/adapters/solana-jito-bundle-guard.test.ts",
  "tests/adversarial/vinetrail-toxic-corpus.test.ts",
  "tests/core/agent-exomesh-guard.test.ts",
  "tests/core/intent-mandate-adversarial.test.ts",
  "tests/core/signing-channel-severance.test.ts",
  "tests/core/solana-soil-mandate.test.ts",
  "tests/core/venue-drift-mandate.test.ts",
  "tests/security/sdk-export-surface.test.ts",
  "tests/docs/multi-repo-ssot-compliance.test.ts",
];

export default defineConfig({
  test: {
    dir: ".",
    pool: "forks",
    setupFiles: ["./vitest.setup.ts"],
    include: VINETRAIL_UNIT_GLOBS,
    testTimeout: 5_000,
    hookTimeout: 5_000,
  },
});
