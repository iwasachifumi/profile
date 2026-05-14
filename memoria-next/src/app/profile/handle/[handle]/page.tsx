import PublicProfileScreen from "@/features/public-profile/PublicProfileScreen";

interface ProfileByHandlePageProps {
  params:       Promise<{ handle: string }>;
  searchParams: Promise<{ via?: string }>;
}

export default async function ProfileByHandlePage({ params, searchParams }: ProfileByHandlePageProps) {
  const { handle } = await params;
  const { via }    = await searchParams;
  return <PublicProfileScreen handle={handle} via={via} />;
}
