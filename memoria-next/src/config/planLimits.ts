export type PlanName = "free" | "pro";

export type PlanLimitConfig = {
  patterns: number;
  fieldsPerPattern: number;
  groups: number;
  exchanges: number;
  customStickerUpload: boolean;
};

// NOTE:
// These are temporary product defaults.
// Update this file when final plan numbers are decided.
export const PLAN_LIMITS: Record<PlanName, PlanLimitConfig> = {
  free: {
    patterns: 3,
    fieldsPerPattern: 30,
    groups: 10,
    exchanges: 100,
    customStickerUpload: false,
  },
  pro: {
    patterns: 20,
    fieldsPerPattern: 200,
    groups: 50,
    exchanges: 5000,
    customStickerUpload: true,
  },
};
