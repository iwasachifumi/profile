import { apiCall } from "./_client";
import type { Profile } from "@/types";

export const publicApi = {
  /** QR や URL から飛んできたとき。認証不要。 */
  getBySlug: (slug: string) =>
    apiCall<Profile>("GET", `/public/${slug}`),

  getByHandle: (handle: string) =>
    apiCall<Profile>("GET", `/public/handle/${handle}`),
};
