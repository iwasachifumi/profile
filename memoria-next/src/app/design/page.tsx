import { redirect } from "next/navigation";

// /design は EditorScreen（/mine）のフレームタブに統合済み
export default function DesignPage() {
  redirect("/mine");
}
