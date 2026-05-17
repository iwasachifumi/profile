import { readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const stampDir = new URL("../stamp/", import.meta.url);
const manifestPath = new URL("../stamp/manifest.js", import.meta.url);
const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const entries = await readdir(stampDir, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => allowed.has(extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "en"));

const lines = [
  "window.MEMORIA_STAMP_MANIFEST = [",
  ...files.map((name) => `  '${name.replaceAll("'", "\\'")}',`),
  "];",
  ""
];

await writeFile(manifestPath, lines.join("\n"), "utf8");
console.log(`manifest updated: ${files.length} files`);
