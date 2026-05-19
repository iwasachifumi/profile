export type PaperThemePalette = {
  id: string;
  paper: string;
  paperStrong: string;
  ink: string;
  swatch: string;
};

export const PAPER_PALETTES: PaperThemePalette[] = [
  { id: "palette-01", paper: "#fffaf3", paperStrong: "#fff4df", ink: "#22201f", swatch: "#f4d8a8" },
  { id: "palette-02", paper: "#fff6ef", paperStrong: "#ffe7d3", ink: "#33231b", swatch: "#f5c8a4" },
  { id: "palette-03", paper: "#fff7f5", paperStrong: "#ffe2da", ink: "#382422", swatch: "#f5b7ad" },
  { id: "palette-04", paper: "#fff5fb", paperStrong: "#ffdff0", ink: "#3a2130", swatch: "#eca6c9" },
  { id: "palette-05", paper: "#fbf4ff", paperStrong: "#eadbff", ink: "#2e2142", swatch: "#c2a4f1" },
  { id: "palette-06", paper: "#f6f3ff", paperStrong: "#ddd5ff", ink: "#242245", swatch: "#a6a0ef" },
  { id: "palette-07", paper: "#f3f7ff", paperStrong: "#dce8ff", ink: "#1f2a44", swatch: "#9bb6ea" },
  { id: "palette-08", paper: "#f1f9ff", paperStrong: "#d7ecff", ink: "#1b3040", swatch: "#89c5ea" },
  { id: "palette-09", paper: "#eefcff", paperStrong: "#d3f1f7", ink: "#17343a", swatch: "#79ced9" },
  { id: "palette-10", paper: "#f0fff8", paperStrong: "#d8f5e8", ink: "#1a352b", swatch: "#89d5b5" },
  { id: "palette-11", paper: "#f4fff3", paperStrong: "#e0f6d9", ink: "#253620", swatch: "#9dce86" },
  { id: "palette-12", paper: "#fbfff2", paperStrong: "#eef6d6", ink: "#343420", swatch: "#c1cd7e" },
  { id: "palette-13", paper: "#fffef2", paperStrong: "#faf0d2", ink: "#37321f", swatch: "#e0c97f" },
  { id: "palette-14", paper: "#fffaf0", paperStrong: "#f7e5cc", ink: "#3a2b1f", swatch: "#d8b38d" },
  { id: "palette-15", paper: "#fff8f7", paperStrong: "#f5e0dc", ink: "#3b2623", swatch: "#d9a69b" },
  { id: "palette-16", paper: "#f9f9f9", paperStrong: "#ececec", ink: "#1f1f1f", swatch: "#cfcfcf" },
  { id: "palette-17", paper: "#f2f4f7", paperStrong: "#e1e6ee", ink: "#1c2430", swatch: "#aab8c9" },
  { id: "palette-18", paper: "#f4f8fa", paperStrong: "#e1ecef", ink: "#1e2b31", swatch: "#9bb8c1" },
  { id: "palette-19", paper: "#f7f5f2", paperStrong: "#ece7de", ink: "#2a2621", swatch: "#b8ae9f" },
  { id: "palette-20", paper: "#f8f6f8", paperStrong: "#ece6ed", ink: "#262226", swatch: "#b8acb9" },
];

const LEGACY_THEME_TO_PALETTE: Record<string, string> = {
  default: "palette-01",
  business: "palette-07",
  study: "palette-10",
  friends: "palette-04",
};

const PALETTE_BY_ID = new Map(PAPER_PALETTES.map((palette) => [palette.id, palette]));

export function resolvePaperTheme(themeId?: string): PaperThemePalette {
  const normalizedId = themeId ? (LEGACY_THEME_TO_PALETTE[themeId] ?? themeId) : "palette-01";
  return PALETTE_BY_ID.get(normalizedId) ?? PAPER_PALETTES[0];
}

export function getPaperThemeCssVars(themeId?: string): Record<string, string> {
  const palette = resolvePaperTheme(themeId);
  return {
    "--paper": palette.paper,
    "--paper-strong": palette.paperStrong,
    "--ink": palette.ink,
  };
}
