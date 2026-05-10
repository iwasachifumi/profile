"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";

const steps = [
  {
    title: "Create profile patterns",
    description:
      "Prepare multiple profile patterns for different contexts such as friends, business, and communities.",
  },
  {
    title: "Share a public URL",
    description:
      "Publish a profile with slug or handle, then share it by URL or QR during in-person meetings.",
  },
  {
    title: "Save exchange history",
    description:
      "Record when and where you exchanged profiles so you can recall people with context later.",
  },
  {
    title: "Maintain profile quality",
    description:
      "Keep fields and links current so your public profile stays useful after each event.",
  },
];

export default function GuideScreen() {
  const { session } = useSession();

  if (session.status === "loading") {
    return (
      <main style={styles.page}>
        <p style={styles.muted}>Loading session...</p>
      </main>
    );
  }

  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/guide" />;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Guide</h1>
          <p style={styles.muted}>How to use Memoria effectively</p>
        </div>
        <div style={styles.nav}>
          <Link href="/mine" style={styles.linkButton}>
            Mine
          </Link>
          <Link href="/book" style={styles.linkButton}>
            Book
          </Link>
          <Link href="/settings" style={styles.linkButton}>
            Settings
          </Link>
        </div>
      </header>

      <section style={styles.grid}>
        {steps.map((step, index) => (
          <article key={step.title} style={styles.card}>
            <span style={styles.badge}>Step {index + 1}</span>
            <h2 style={styles.cardTitle}>{step.title}</h2>
            <p style={styles.cardText}>{step.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(120deg, #f8fafc 0%, #e2e8f0 100%)",
    display: "grid",
    gap: "16px",
  },
  header: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  nav: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "24px",
  },
  muted: {
    margin: 0,
    color: "#475569",
    fontSize: "13px",
  },
  grid: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "14px",
    display: "grid",
    gap: "8px",
  },
  badge: {
    display: "inline-flex",
    width: "fit-content",
    border: "1px solid #334155",
    borderRadius: "999px",
    padding: "2px 8px",
    fontSize: "12px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "18px",
  },
  cardText: {
    margin: 0,
    color: "#334155",
    lineHeight: 1.5,
    fontSize: "14px",
  },
  linkButton: {
    border: "1px solid #475569",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    padding: "8px 10px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

