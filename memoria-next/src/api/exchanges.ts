import { apiCall } from "./_client";
import type { Exchange } from "@/types";

export const exchangesApi = {
  list: () =>
    apiCall<Exchange[]>("GET", "/exchanges"),

  create: (exchange: Exchange) =>
    apiCall<{ id: string }>("POST", "/exchanges", exchange),

  update: (id: string, patch: Partial<Exchange>) =>
    apiCall<{ id: string }>("PUT", `/exchanges/${id}`, patch),

  remove: (id: string) =>
    apiCall<{ id: string }>("DELETE", `/exchanges/${id}`),
};
