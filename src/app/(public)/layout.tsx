import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Public layout — wraps semua halaman publik
 * Menyertakan Navbar dan Footer.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
