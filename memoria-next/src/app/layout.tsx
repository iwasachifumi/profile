import type { Metadata } from "next";
import { SessionProvider } from "@/store/session";
import { UiProvider } from "@/store/ui";
import { LanguageProvider } from "@/store/language";

export const metadata: Metadata = {
  title: "Memoria",
  description: "プロフ帳アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <LanguageProvider>
          <SessionProvider>
            <UiProvider>
              {children}
            </UiProvider>
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
