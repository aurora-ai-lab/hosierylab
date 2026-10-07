import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "HosieryLab — Every pair, under the same light.",
  description: "The visual intelligence database for hosiery, built for designers, stylists and AI character creators.",
  metadataBase: new URL("https://hosierylab.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "HosieryLab — Every pair, under the same light.",
    description: "A visual intelligence database for hosiery, organized by length, coverage, Denier, color and construction.",
    url: "https://hosierylab.com",
    siteName: "HosieryLab",
    type: "website",
    images: [{ url: "/reference/hero-main.png", alt: "Hosiery denier comparison board" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<SiteFooter /></body></html>;
}
