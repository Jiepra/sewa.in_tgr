import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin — sewa_in.tgr",
};

/**
 * Layout khusus untuk halaman login admin.
 * Tidak menggunakan AdminLayout agar tidak ada sidebar saat belum login.
 */
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
