import PublicProfileScreen from "@/features/public-profile/PublicProfileScreen";

interface ProfileByHandlePageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProfileByHandlePage({ params }: ProfileByHandlePageProps) {
  const { handle } = await params;
  return <PublicProfileScreen handle={handle} />;
}
