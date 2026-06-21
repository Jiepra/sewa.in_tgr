/**
 * Admin root layout — intentionally minimal.
 *
 * - /admin/login       → uses its own layout (no sidebar)
 * - /admin/(protected) → uses ProtectedAdminLayout (with sidebar)
 *
 * This root layout just passes children through so route groups
 * can each define their own layout independently.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
