import type { Metadata } from "next";
import "@/app/globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: { absolute: "Area riservata — Aleclima" },
  // l'area admin non deve finire su Google in nessun caso
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
