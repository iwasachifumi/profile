import type { Metadata } from "next";
import { getProfileBySlug } from "@/lib/db";
import PublicProfileScreen from "@/features/public-profile/PublicProfileScreen";

interface ProfilePageProps {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ via?: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://profile.ac7.co.jp";

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug).catch(() => null);
  if (!profile) return { title: "Memoria" };

  const title       = profile.description || profile.patternName || "Memoria";
  const description = `${title}のプロフィール - Memoria`;
  const ogImageUrl  = `${BASE_URL}/api/og/${profile.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url:    `${BASE_URL}/profile/${slug}`,
      images: [{ url: ogImageUrl, width: 960, height: 580, alt: title }],
      type:   "profile",
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [ogImageUrl],
    },
  };
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { slug } = await params;
  const { via }  = await searchParams;
  return <PublicProfileScreen slug={slug} via={via} />;
}
