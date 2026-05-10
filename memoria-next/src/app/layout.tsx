import type { Metadata } from "next";
import { SessionProvider } from "@/store/session";
import { UiProvider } from "@/store/ui";

export const metadata: Metadata = {
  title: "Memoria",
  description: "プロフ帳アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
          <UiProvider>
            {children}
          </UiProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
