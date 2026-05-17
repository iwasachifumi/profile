import { render } from './render.js';
import { handleInput, handleChange, handleClick, handleStickerDrag } from './events.js';
import { getInitialUser, onAuthChange } from './lib/auth.js';
import {
  authSession, saveAuthSession, applyState, loadState, loadStateFromSupabase, flushSupabaseSync
} from './store.js';

window.addEventListener("hashchange", render);
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("click", handleClick);
document.addEventListener("pointerdown", handleStickerDrag);

// タブを離れる/閉じるときに、debounce 中の Supabase 同期を即座に流す。
window.addEventListener("pagehide", () => { flushSupabaseSync(); });
window.addEventListener("beforeunload", () => { flushSupabaseSync(); });

async function init() {
  // Supabase が永続化済みのセッションを持っていれば user モードで起動
  const { user } = await getInitialUser();
  if (user) {
    saveAuthSession({
      mode: "user",
      userId: user.id,
      email: user.email,
      lastLoginAt: user.lastLoginAt
    });
    // Supabase からデータをロード(失敗時は localStorage キャッシュにフォールバック)
    await loadStateFromSupabase(user);
  }

  render();

  // 外部要因(トークン期限切れ・別タブでサインアウト等)でセッションが消えた
  // ときに自動でログアウト状態に追従する。
  onAuthChange((u) => {
    if (!u && authSession.mode === "user") {
      saveAuthSession({ mode: "none" });
      applyState(loadState(authSession));
      render();
    }
  });
}

init();
