import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SilkAmbient } from "@/components/SilkAmbient";
import Script from "next/script";

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
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><SilkAmbient />{children}<SiteFooter /><Script defer data-domain="hosierylab.com" src="https://plausible.io/js/script.js" /></body></html>;
}


