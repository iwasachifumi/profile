import PreviewScreen from "@/features/preview/PreviewScreen";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  return <PreviewScreen id={id} />;
}
