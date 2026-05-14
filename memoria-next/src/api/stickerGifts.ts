import { apiCall } from "./_client";
import type { StickerGiftInboxItem } from "@/types";

export type GiftStickerPayload = {
  label: string;
  assetSrc: string;
};

export const stickerGiftsApi = {
  send: (toHandle: string, sticker: GiftStickerPayload) =>
    apiCall<{ id: string }>("POST", "/sticker-gifts", { toHandle, sticker }),

  inbox: () =>
    apiCall<StickerGiftInboxItem[]>("GET", "/sticker-gifts/inbox"),

  accept: (id: string) =>
    apiCall<{ id: string; status: "accepted"; added: boolean }>(
      "POST",
      `/sticker-gifts/${id}/accept`
    ),

  reject: (id: string) =>
    apiCall<{ id: string; status: "rejected" }>(
      "POST",
      `/sticker-gifts/${id}/reject`
    ),
};
