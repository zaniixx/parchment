import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

// Set here in Node rather than inline shell syntax (`ELEVENTY_ENV=production eleventy`)
// so this script runs identically on Windows and POSIX shells without needing cross-env.
process.env.ELEVENTY_ENV = "production";

if (!existsSync("src/_data")) mkdirSync("src/_data", { recursive: true });
if (!existsSync("src/_data/weights.json")) writeFileSync("src/_data/weights.json", "{}");

// Pass 1: render the site so compute-weights.mjs has real output files to measure.
execSync("npx eleventy", { stdio: "inherit" });

execSync("node scripts/compute-weights.mjs", { stdio: "inherit" });

// Pass 2: re-render so templates can read the now-populated weights.json.
execSync("npx eleventy", { stdio: "inherit" });
