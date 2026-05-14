import AuthScreen from "@/features/auth/AuthScreen";

interface HomeProps {
  searchParams: Promise<{
    google_error?: string;
    return?: string;
    mode?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { google_error, return: returnTo, mode } = await searchParams;

  return (
    <AuthScreen
      redirectOnAuth={returnTo ?? "/mine"}
      googleError={google_error}
      defaultMode={mode === "register" ? "register" : "login"}
    />
  );
}
