import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = join(fileURLToPath(new URL("../..", import.meta.url)));

const LEGACY_PATTERNS: { label: string; re: RegExp }[] = [
  { label: "legacy-a", re: new RegExp(["syl", "vangate"].join(""), "i") },
  { label: "legacy-b", re: new RegExp(["be", "delta"].join(""), "i") },
  { label: "legacy-c", re: new RegExp(["soil", "_", "core"].join("")) },
  { label: "legacy-d", re: new RegExp(["Sylvan", "Gate"].join("")) },
  { label: "legacy-e", re: new RegExp(["Be", "Delta"].join("")) },
  { label: "legacy-perm-ingress", re: new RegExp(["robin", "hood"].join(""), "i") },
];

const SKIP_DIR_NAMES = new Set(["node_modules", "target", ".git", "dist"]);
const BINARY_EXT = new Set([
  ".wasm",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".mp4",
  ".ico",
  ".pdf",
  ".zip",
]);

type SkuRepo = { repoSlug: string; githubUrl?: string };
type MultiRepoSsot = {
  schemaVersion: number;
  githubOrg: string;
  skuRepos: SkuRepo[];
  sharedCore: { wasmAbiVersion: number; wasmAbiVersionSource: string };
};

function loadSsot(): MultiRepoSsot {
  const path = join(ROOT, "docs/_snippets/multi-repo-ssot.json");
  return JSON.parse(readFileSync(path, "utf8")) as MultiRepoSsot;
}

function walkRepoFiles(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR_NAMES.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkRepoFiles(full, out);
      continue;
    }
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
    if (BINARY_EXT.has(ext.toLowerCase())) continue;
    out.push(full);
  }
}

function collectAllTextFiles(): string[] {
  const files: string[] = [];
  walkRepoFiles(ROOT, files);
  return files;
}

const SELF_REL = "tests/docs/multi-repo-ssot-compliance.test.ts";

function scanLegacyViolations(): string[] {
  const violations: string[] = [];
  for (const file of collectAllTextFiles()) {
    const rel = relative(ROOT, file);
    if (rel === SELF_REL) continue;
    const text = `${rel}\n${readFileSync(file, "utf8")}`;
    for (const { label, re } of LEGACY_PATTERNS) {
      if (re.test(text)) {
        violations.push(`${rel}: matched /${label}/`);
      }
    }
  }
  return violations;
}

describe("multi-repo-ssot.json", () => {
  it("defines vinetrail org, three SKU repos, and wasm ABI parity", () => {
    const ssot = loadSsot();
    expect(ssot.schemaVersion).toBeGreaterThanOrEqual(3);
    expect(ssot.githubOrg).toBe("vinetrail");
    expect(ssot.skuRepos).toHaveLength(3);
    const slugs = ssot.skuRepos.map((r) => r.repoSlug);
    expect(new Set(slugs).size).toBe(3);
    for (const repo of ssot.skuRepos) {
      expect(repo.githubUrl).toMatch(new RegExp(`github\\.com/vinetrail/${repo.repoSlug}$`));
    }
    const evalSrc = readFileSync(join(ROOT, ssot.sharedCore.wasmAbiVersionSource), "utf8");
    const m = evalSrc.match(/WASM_ABI_VERSION:\s*u32\s*=\s*(\d+)/);
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBe(ssot.sharedCore.wasmAbiVersion);
  });

  it("has zero legacy brand strings anywhere in the repository", () => {
    expect(scanLegacyViolations()).toEqual([]);
  });
});
