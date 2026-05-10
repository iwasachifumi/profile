import PublicProfileScreen from "@/features/public-profile/PublicProfileScreen";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  return <PublicProfileScreen slug={slug} />;
}
