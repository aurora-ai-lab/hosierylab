import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HosieryLab — Every pair, under the same light.",
  description: "The visual intelligence database for hosiery.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
