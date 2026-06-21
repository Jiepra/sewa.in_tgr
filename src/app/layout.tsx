import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "sewa_in.tgr — Sewa Alat Gunung & Camping Tangerang",
    template: "%s | sewa_in.tgr",
  },
  description:
    "Sewa alat gunung dan camping berkualitas di Pasar Kemis, Kabupaten Tangerang. Tenda, sleeping bag, carrier, kompor, dan perlengkapan outdoor lainnya. Booking mudah, harga terjangkau.",
  keywords: [
    "sewa alat gunung",
    "sewa tenda",
    "sewa carrier",
    "camping gear",
    "outdoor rental",
    "tangerang",
    "pasar kemis",
    "sewa_in",
  ],
  authors: [{ name: "sewa_in.tgr" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "sewa_in.tgr",
    title: "sewa_in.tgr — Sewa Alat Gunung & Camping",
    description:
      "Sewa alat gunung dan camping berkualitas. Booking mudah, harga terjangkau.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
