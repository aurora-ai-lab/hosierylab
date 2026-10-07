import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & licensing | HosieryLab",
  description: "Usage notes and licensing guidance for HosieryLab synthetic references and prompts.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <main className="shell content-page"><Link className="back-link" href="/">← Back to HosieryLab</Link><p className="eyebrow">TERMS & LICENSING</p><h1>Use the references responsibly.</h1><p className="content-lede">HosieryLab records are structured visual references for design, research and prompt development.</p><section className="detail-section"><h2>Synthetic imagery</h2><p>Unless a record says otherwise, images are synthetic references. They are not photographs of a named person and should not be presented as documentary evidence or as a real product listing.</p><h2>Prompts</h2><p>Prompts may be copied for personal experimentation and development. Keep the record code and source link when publishing a study built from a HosieryLab prompt.</p><h2>Content boundaries</h2><p>Do not use the materials to depict minors, real people without permission, or copyrighted characters as if they were official endorsements. Keep generated fashion scenes non-explicit and clearly adult.</p><h2>Questions</h2><p>For licensing questions, contact the HosieryLab operator before commercial redistribution of prompt packs or bulk exports.</p></section></main>;
}
