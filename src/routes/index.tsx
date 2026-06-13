import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import "@/jcimlas-os/os.css";

const JcimlasOS = lazy(() => import("@/jcimlas-os/AppShell"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "jcimlasOS" },
      { name: "description", content: "jcimlasOS — a desktop OS simulator in the browser." },
      { property: "og:title", content: "jcimlasOS" },
      { property: "og:description", content: "jcimlasOS — a desktop OS simulator in the browser." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", background: "#1E1E1E" }} />
    );
  }

  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#1E1E1E" }} />}>
      <JcimlasOS />
    </Suspense>
  );
}
