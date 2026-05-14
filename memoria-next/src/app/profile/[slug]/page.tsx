import PublicProfileScreen from "@/features/public-profile/PublicProfileScreen";

interface ProfilePageProps {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ via?: string }>;
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { slug } = await params;
  const { via }  = await searchParams;
  return <PublicProfileScreen slug={slug} via={via} />;
}
