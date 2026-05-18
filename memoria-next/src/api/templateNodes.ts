import { apiCall } from "./_client";
import type { ApiResult } from "@/types";

export type TemplateNode = {
  id: string;
  name: string;
  path: string[];
  questions: { label: string; placeholder: string }[];
};

export const templateNodesApi = {
  getAll(): Promise<ApiResult<TemplateNode[]>> {
    return apiCall<TemplateNode[]>("GET", "/template-nodes");
  },
};
