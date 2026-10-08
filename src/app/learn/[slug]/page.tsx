import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { SiteHeader } from "@/components/SiteHeader";
import { getLearnArticle, learnArticles } from "@/lib/learnArticles";

export function generateStaticParams() {
  return learnArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) return {};
  return { title: `${article.title} · 丝袜百科 · HosieryLab`, description: article.summary, alternates: { canonical: `/learn/${article.slug}` } };
}

export default async function LearnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) notFound();
  const filter = article.relatedFilters[0];
  return <><SiteHeader /><main className="shell article-page"><Link className="back-link" href="/learn">← 返回丝袜百科</Link><div className="article-hero"><p className="eyebrow">丝袜百科 · KNOWLEDGE</p><h1>{article.title}</h1><p>{article.summary}</p></div><MarkdownArticle body={article.body} /><section className="article-cta"><p className="section-kicker">继续查找</p><h2>把这篇知识放回目录里。</h2><p>用相关筛选条件查看本站的实际丝袜记录，复制完整提示词或单独的丝袜段落。</p><Link className="button button-dark" href={filter ? `/hosiery?${filter}` : "/hosiery"}>查看相关丝袜 →</Link></section></main></>;
}
