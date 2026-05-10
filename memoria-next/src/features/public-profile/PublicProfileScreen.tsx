"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { publicApi } from "@/api/public";
import type { Profile } from "@/types";

interface PublicProfileScreenProps {
  slug?: string;
  handle?: string;
}

export default function PublicProfileScreen({ slug, handle }: PublicProfileScreenProps) {
  const hasIdentifier = Boolean(slug || handle);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(hasIdentifier);
  const [error, setError] = useState<string | null>(
    hasIdentifier ? null : "Public profile identifier is missing."
  );

  useEffect(() => {
    if (!hasIdentifier) return;
    let alive = true;

    const request = slug ? publicApi.getBySlug(slug) : publicApi.getByHandle(handle ?? "");

    request.then((result) => {
      if (!alive) return;
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setProfile(result.data);
    });

    return () => {
      alive = false;
    };
  }, [handle, hasIdentifier, slug]);

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.muted}>Loading public profile...</p>
        </section>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Profile Not Found</h1>
          <p style={styles.muted}>{error ?? "The profile is unavailable."}</p>
          <Link href="/" style={styles.linkButton}>
            Back
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>{profile.patternName}</h1>
        <p style={styles.muted}>audience: {profile.audience || "-"}</p>
        <p style={styles.text}>{profile.description || "-"}</p>

        <div style={styles.metaGrid}>
          <div style={styles.metaItem}>
            <strong>handle</strong>
            <span>{profile.handle ?? "-"}</span>
          </div>
          <div style={styles.metaItem}>
            <strong>theme</strong>
            <span>{profile.themeId}</span>
          </div>
          <div style={styles.metaItem}>
            <strong>frame</strong>
            <span>{profile.frameId}</span>
          </div>
          <div style={styles.metaItem}>
            <strong>fields</strong>
            <span>{profile.fields.length}</span>
          </div>
        </div>

        <Link href="/" style={styles.linkButton}>
          Open App
        </Link>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "720px",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    padding: "24px",
    display: "grid",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "30px",
  },
  text: {
    margin: 0,
    lineHeight: 1.6,
    color: "#0f172a",
  },
  muted: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },
  metaItem: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px",
    display: "grid",
    gap: "4px",
    fontSize: "14px",
  },
  linkButton: {
    border: "1px solid #334155",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    padding: "8px 10px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
  },
};
