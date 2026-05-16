import AuthScreen from "@/features/auth/AuthScreen";

interface LoginProps {
  searchParams: Promise<{
    google_error?: string;
    return?: string;
    mode?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginProps) {
  const { google_error, return: returnTo, mode } = await searchParams;

  return (
    <AuthScreen
      redirectOnAuth={returnTo ?? "/mine"}
      googleError={google_error}
      defaultMode={mode === "register" ? "register" : "login"}
    />
  );
}
