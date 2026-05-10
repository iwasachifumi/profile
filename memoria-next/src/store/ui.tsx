"use client";

// UI 状態の管理（タブ・選択中パターン・モーダル等）
// 現行 js/store.js の UI 関連変数を React に移植したもの。

import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

// ── 型 ───────────────────────────────────────────────────────────────────────

type AuthTab   = "login" | "register";
type AppTab    = "mine" | "book" | "settings";
type ProfileTab = "edit" | "preview" | "qr";
type BookView  = "list" | "detail";

interface UiState {
  authTab:             AuthTab;
  appTab:              AppTab;
  activePatternId:     string | null;
  activeProfileTab:    ProfileTab;
  selectedExchangeId:  string | null;
  activeBookView:      BookView;
  stickerPage:         number;
  // モーダル
  modalId:             string | null;
}

type UiAction =
  | { type: "SET_AUTH_TAB";           payload: AuthTab }
  | { type: "SET_APP_TAB";            payload: AppTab }
  | { type: "SET_ACTIVE_PATTERN";     payload: string | null }
  | { type: "SET_PROFILE_TAB";        payload: ProfileTab }
  | { type: "SET_SELECTED_EXCHANGE";  payload: string | null }
  | { type: "SET_BOOK_VIEW";          payload: BookView }
  | { type: "SET_STICKER_PAGE";       payload: number }
  | { type: "OPEN_MODAL";             payload: string }
  | { type: "CLOSE_MODAL" };

// ── 初期値 ────────────────────────────────────────────────────────────────────

const initialUiState: UiState = {
  authTab:            "login",
  appTab:             "mine",
  activePatternId:    null,
  activeProfileTab:   "edit",
  selectedExchangeId: null,
  activeBookView:     "list",
  stickerPage:        0,
  modalId:            null,
};

// ── Reducer ───────────────────────────────────────────────────────────────────

function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case "SET_AUTH_TAB":          return { ...state, authTab: action.payload };
    case "SET_APP_TAB":           return { ...state, appTab: action.payload };
    case "SET_ACTIVE_PATTERN":    return { ...state, activePatternId: action.payload };
    case "SET_PROFILE_TAB":       return { ...state, activeProfileTab: action.payload };
    case "SET_SELECTED_EXCHANGE": return { ...state, selectedExchangeId: action.payload };
    case "SET_BOOK_VIEW":         return { ...state, activeBookView: action.payload };
    case "SET_STICKER_PAGE":      return { ...state, stickerPage: action.payload };
    case "OPEN_MODAL":            return { ...state, modalId: action.payload };
    case "CLOSE_MODAL":           return { ...state, modalId: null };
    default:                      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface UiContext {
  ui: UiState;
  dispatch: React.Dispatch<UiAction>;
}

const Ctx = createContext<UiContext | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [ui, dispatch] = useReducer(uiReducer, initialUiState);
  return <Ctx.Provider value={{ ui, dispatch }}>{children}</Ctx.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useUi(): UiContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUi は UiProvider の内側で使ってください");
  return ctx;
}
