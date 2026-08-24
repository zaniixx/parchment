import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { gzipSync } from "node:zlib";

function walkHtmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkHtmlFiles(full, out);
    } else if (entry.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

const weights = {};
for (const file of walkHtmlFiles("_site")) {
  const html = readFileSync(file);
  let url = "/" + relative("_site", file).split(sep).join("/");
  url = url.replace(/index\.html$/, "").replace(/\.html$/, "/");
  weights[url] = { bytes: html.length, gzipBytes: gzipSync(html, { level: 9 }).length };
}

writeFileSync("src/_data/weights.json", JSON.stringify(weights));
console.log(`compute-weights: measured ${Object.keys(weights).length} page(s).`);
