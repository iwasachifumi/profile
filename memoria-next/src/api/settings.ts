import { apiCall } from "./_client";
import type { UserSettings } from "@/types";

export const settingsApi = {
  get: () =>
    apiCall<UserSettings>("GET", "/settings"),

  update: (settings: UserSettings) =>
    apiCall<null>("PUT", "/settings", settings),

  setPlan: (plan: "free" | "pro") =>
    apiCall<{ plan: "free" | "pro" }>("PUT", "/settings/plan", { plan }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiCall<null>("POST", "/auth/change-password", { currentPassword, newPassword }),
};
