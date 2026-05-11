import { apiCall } from "./_client";
import type { Profile } from "@/types";

export const profilesApi = {
  list: () =>
    apiCall<Profile[]>("GET", "/profiles"),

  getById: (id: string) =>
    apiCall<Profile>("GET", `/profiles/${id}`),

  create: (profile: Profile) =>
    apiCall<{ id: string }>("POST", "/profiles", profile),

  update: (id: string, patch: Partial<Profile>) =>
    apiCall<{ id: string }>("PUT", `/profiles/${id}`, patch),

  remove: (id: string) =>
    apiCall<{ id: string }>("DELETE", `/profiles/${id}`),
};
