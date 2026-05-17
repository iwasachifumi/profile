export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

export function linkify(value) {
  return value.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
}

export function escapeSvg(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function makeStickerImage(sticker) {
  const palettes = {
    smile: { bg: "#ffd452", ink: "#2b220e", sub: "#fff5c5" },
    heart: { bg: "#ffd1e3", ink: "#8e265f", sub: "#ffc0d8" },
    friends: { bg: "#ffe8b0", ink: "#3a2a08", sub: "#fff2cc" },
    kawaii: { bg: "#ffd9f0", ink: "#8d2f6e", sub: "#ffeaf8" },
    heart_frame: { bg: "#ffd3eb", ink: "#a02f72", sub: "#ffe8f6" },
    emoji: { bg: sticker.color || "#dcecff", ink: "#22201f", sub: "#eff4ff" },
    default: { bg: sticker.color || "#dcecff", ink: "#22201f", sub: "#eff4ff" }
  };
  const palette = palettes[sticker.variant] || palettes.default;

  let body = "";

  if (sticker.variant === "smile") {
    body = `
      <circle cx="80" cy="52" r="35" fill="${palette.bg}" stroke="#a67a00" stroke-width="4"/>
      <circle cx="52" cy="49" r="7" fill="${palette.ink}"/>
      <circle cx="108" cy="49" r="7" fill="${palette.ink}"/>
      <path d="M46 69c6 8 14 12 24 12s18-4 24-12" fill="none" stroke="${palette.ink}" stroke-width="6" stroke-linecap="round"/>
      <text x="80" y="34" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="14" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
    `;
  } else if (sticker.variant === "heart") {
    body = `
      <path d="M25 52c0-20 16-35 35-35 8 0 14 2 20 8 6-6 12-8 20-8 19 0 35 15 35 35 0 18-10 30-25 40-16 11-30 20-30 20s-14-9-30-20C35 82 25 70 25 52z" fill="${palette.bg}" stroke="#c5538d" stroke-width="4"/>
      <path d="M36 44c0-8 6-13 12-13 5 0 8 2 12 7 4-5 7-7 12-7 6 0 12 5 12 13 0 12-9 18-24 29-15-11-24-17-24-29z" fill="${palette.ink}" opacity=".82"/>
      <path d="M96 61c0-6 4-10 9-10 4 0 6 2 9 6 3-4 5-6 9-6 5 0 9 4 9 10 0 9-6 14-18 22-12-8-18-13-18-22z" fill="${palette.ink}" opacity=".52"/>
      <text x="70" y="84" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="15" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
    `;
  } else if (sticker.variant === "friends") {
    body = `
      <ellipse cx="80" cy="52" rx="56" ry="34" fill="${palette.bg}" stroke="#c09a3d" stroke-width="4"/>
      <circle cx="54" cy="52" r="18" fill="${palette.sub}" stroke="#8b6a1f" stroke-width="3"/>
      <circle cx="103" cy="52" r="18" fill="#fff3d4" stroke="#8b6a1f" stroke-width="3"/>
      <circle cx="48" cy="50" r="2.8" fill="${palette.ink}"/>
      <circle cx="59" cy="50" r="2.8" fill="${palette.ink}"/>
      <path d="M48 59c3 3 6 4 10 4 4 0 7-1 10-4" fill="none" stroke="${palette.ink}" stroke-width="2.7" stroke-linecap="round"/>
      <circle cx="97" cy="50" r="2.8" fill="${palette.ink}"/>
      <circle cx="108" cy="50" r="2.8" fill="${palette.ink}"/>
      <path d="M97 59c3 3 6 4 10 4 4 0 7-1 10-4" fill="none" stroke="${palette.ink}" stroke-width="2.7" stroke-linecap="round"/>
      <text x="80" y="32" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="14" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
    `;
  } else if (sticker.variant === "kawaii") {
    body = `
      <ellipse cx="80" cy="54" rx="54" ry="30" fill="${palette.bg}" stroke="#bf5f95" stroke-width="4"/>
      <path d="M42 34l5 10 11 2-8 8 2 11-10-6-10 6 2-11-8-8 11-2z" fill="${palette.ink}" opacity=".85"/>
      <path d="M117 35l3 7 8 1-6 6 2 8-7-4-7 4 2-8-6-6 8-1z" fill="${palette.ink}" opacity=".65"/>
      <text x="82" y="66" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="15" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
      <path d="M65 77h55" stroke="${palette.ink}" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    `;
  } else if (sticker.variant === "heart_frame") {
    body = `
      <path d="M80 16c14 0 26 9 30 22 14 2 26 13 26 28 0 16-13 28-29 28H53C37 94 24 82 24 66c0-15 12-27 26-28 4-13 16-22 30-22z" fill="${palette.sub}" stroke="#bf4f8f" stroke-width="4"/>
      <rect x="42" y="29" width="76" height="48" rx="10" fill="#ffffff" stroke="#d76fa5" stroke-width="3" stroke-dasharray="5 4"/>
      <path d="M21 24c0-5 4-8 8-8 3 0 5 1 7 4 2-3 4-4 7-4 4 0 8 3 8 8 0 7-5 11-15 18-10-7-15-11-15-18z" fill="#d93f8d"/>
      <path d="M112 87c0-5 4-8 8-8 3 0 5 1 7 4 2-3 4-4 7-4 4 0 8 3 8 8 0 7-5 11-15 18-10-7-15-11-15-18z" fill="#d93f8d"/>
      <text x="80" y="58" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="11" fill="${palette.ink}">${escapeSvg("PHOTO")}</text>
      <text x="80" y="82" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="11" fill="${palette.ink}" opacity=".8">${escapeSvg("♥ frame")}</text>
    `;
  } else if (sticker.variant === "emoji") {
    body = `
      <path d="M32 31c10-10 22-13 48-13s38 3 48 13c10 10 12 22 12 22s-2 12-12 22c-10 10-22 13-48 13s-38-3-48-13c-10-10-12-22-12-22s2-12 12-22z" fill="${palette.bg}" stroke="#22201f" stroke-opacity=".2" stroke-width="3"/>
      <circle cx="33" cy="31" r="5" fill="${palette.sub}" opacity=".75"/>
      <circle cx="127" cy="74" r="6" fill="${palette.sub}" opacity=".75"/>
      <text x="80" y="59" text-anchor="middle" font-family="'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Segoe UI', sans-serif" font-size="30">${escapeSvg(sticker.emoji || "✨")}</text>
      <text x="80" y="85" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="10.5" fill="${palette.ink}" letter-spacing=".6">${escapeSvg(sticker.label)}</text>
    `;
  } else {
    body = `
      <path d="M30 33c11-9 25-12 50-12s39 3 50 12c10 9 12 19 12 19s-2 10-12 19c-11 9-25 12-50 12s-39-3-50-12c-10-9-12-19-12-19s2-10 12-19z" fill="${palette.bg}" stroke="#22201f" stroke-opacity=".26" stroke-width="3"/>
      <text x="80" y="61" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="18" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="104" viewBox="0 0 160 104">
      ${body}
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function initialOf(name) {
  const trimmed = String(name || "M").trim();
  return trimmed.slice(0, 1).toUpperCase();
}

export function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result || "");
      const img = new Image();
      img.onload = () => {
        const maxEdge = 960;
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(raw);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = (file.type || "").toLowerCase() === "image/png";
        resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", isPng ? undefined : 0.86));
      };
      img.onerror = () => reject(new Error("image_decode_error"));
      img.src = raw;
    };
    reader.onerror = () => reject(reader.error || new Error("file_read_error"));
    reader.readAsDataURL(file);
  });
}

export function sanitizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatStampLabel(fileName) {
  const base = String(fileName || "")
    .replace(/\.[^.]+$/, "")
    .replaceAll(/[_-]+/g, " ")
    .trim();
  return base || "STAMP";
}

export function loadStampStickers(manifest) {
  if (!Array.isArray(manifest) || manifest.length === 0) return [];
  return manifest
    .map((entry, index) => {
      const isString = typeof entry === "string";
      const file = isString ? entry : entry?.file;
      if (!file) return null;
      const src = isString ? `stamp/${file}` : (entry.src || `stamp/${file}`);
      return {
        id: isString ? `stamp_${index + 1}` : (entry.id || `stamp_${index + 1}`),
        label: isString ? formatStampLabel(file) : (entry.label || formatStampLabel(file)),
        className: entry?.className || "sticker-blue",
        color: entry?.color || "#dcecff",
        source: entry?.source || "free",
        owned: entry?.owned !== false,
        variant: "asset",
        assetSrc: src
      };
    })
    .filter(Boolean);
}
