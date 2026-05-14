import { redirect } from "next/navigation";

// /stickers は EditorScreen（/mine）のシールタブに統合済み
export default function StickersPage() {
  redirect("/mine");
}
