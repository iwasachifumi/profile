import QrCardScreen from "@/features/qr-card/QrCardScreen";

interface PageProps {
  params: Promise<{ profileId: string }>;
}

export default async function CardPage({ params }: PageProps) {
  const { profileId } = await params;
  return <QrCardScreen profileId={profileId} />;
}
