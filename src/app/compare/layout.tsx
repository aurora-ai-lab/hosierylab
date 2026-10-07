import type { Metadata } from "next";
export const metadata: Metadata = { title: "Compare Hosiery · HosieryLab", description: "Put hosiery specimens side by side and isolate one visual variable at a time.", alternates: { canonical: "/compare" }, openGraph: { title: "Compare Hosiery · HosieryLab", description: "Controlled hosiery comparisons.", url: "/compare" } };
export default function CompareLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
