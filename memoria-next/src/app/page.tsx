import AuthScreen from "@/features/auth/AuthScreen";

interface HomeProps {
  searchParams: Promise<{ google_error?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { google_error } = await searchParams;
  return <AuthScreen redirectOnAuth="/mine" googleError={google_error} />;
}
