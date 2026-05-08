import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function getArgValue(flag, fallback = "") {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] || fallback;
}

const rootDir = resolve(process.cwd());
const host = getArgValue("--host", "127.0.0.1");
const portValue = getArgValue("--port", process.env.PORT || "4173");
const port = Number.parseInt(portValue, 10);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error(`[dev-server] Invalid port: ${portValue}`);
  process.exit(1);
}

function safePathFromUrl(urlString = "/") {
  const requestUrl = new URL(urlString, "http://localhost");
  let pathname = decodeURIComponent(requestUrl.pathname || "/");
  if (pathname === "/") pathname = "/index.html";
  const normalized = normalize(pathname).replace(/^(\.\.[\\/])+/, "");
  return join(rootDir, normalized);
}

function sendFile(res, absolutePath) {
  const ext = extname(absolutePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const isHtml = ext === ".html";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": isHtml ? "no-store" : "public, max-age=300"
  });
  createReadStream(absolutePath).pipe(res);
}

const server = createServer((req, res) => {
  try {
    const filePath = safePathFromUrl(req.url || "/");
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      sendFile(res, filePath);
      return;
    }

    const ext = extname(filePath).toLowerCase();
    if (!ext) {
      const indexPath = join(rootDir, "index.html");
      if (existsSync(indexPath) && statSync(indexPath).isFile()) {
        sendFile(res, indexPath);
        return;
      }
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Server Error: ${error instanceof Error ? error.message : "unknown"}`);
  }
});

server.listen(port, host, () => {
  const printableHost = host === "0.0.0.0" ? "localhost" : host;
  console.log(`[dev-server] Serving ${rootDir}`);
  console.log(`[dev-server] http://${printableHost}:${port}/`);
});
