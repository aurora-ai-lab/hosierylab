import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HosieryLab — Every pair, under the same light.",
  description: "The visual intelligence database for hosiery.",
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
  return <html lang="en"><body>{children}</body></html>;
}
