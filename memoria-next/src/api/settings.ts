import { apiCall } from "./_client";
import type { UserSettings } from "@/types";

export const settingsApi = {
  get: () =>
    apiCall<UserSettings>("GET", "/settings"),

  update: (settings: UserSettings) =>
    apiCall<null>("PUT", "/settings", settings),
};
