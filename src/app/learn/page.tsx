import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { HosieryCard } from "@/components/HosieryCard";
import { allHosiery } from "@/lib/data";
import { learnArticles } from "@/lib/learnArticles";

export const metadata = { title: "丝袜百科 · HosieryLab", description: "用 D 数、透明度、长度、颜色和光泽理解丝袜，再回到目录选择可复制的记录。", alternates: { canonical: "/learn" } };

const topics = [
  ["D数与透明度", "D 数是纤维线密度的参考，透明度还会受到颜色、织法和光线影响。", "/hosiery?denier=11-20"],
  ["长度与结构", "过膝、大腿袜、吊带袜和连裤袜的差别首先在上端位置与连接方式。", "/hosiery?length=thigh_high"],
  ["颜色与光泽", "肉色不是一个固定颜色；哑光、自然光和缎光会改变同一颜色的视觉重量。", "/hosiery?color=skin_tone"],
  ["常见误解", "低 D 数通常更薄，但图案、网眼、颜色和拍摄光线会改变最后的观感。", "/hosiery?denier=11-20"],
  ["历史与工艺", "丝、尼龙、精细针织、袜口和后跟结构共同形成今天的丝袜视觉语言。", "/history"],
];

export default function LearnPage() {
  const samples = allHosiery.filter((item) => item.denier !== null).slice(3, 6);
  return <><SiteHeader /><main className="shell article-page"><div className="article-hero"><p className="eyebrow">THE HOSIERY ENCYCLOPEDIA</p><h1>先理解，<em>再选择。</em></h1><p>把常见的丝袜叫法拆成可观察的变量，回到目录后更容易找到真正匹配的记录。</p></div><div className="topic-list">{topics.map(([title, description, href], index) => <article className="topic-row" key={title}><span>0{index + 1}</span><div><h2>{title}</h2><p>{description}</p></div><Link className="text-link" href={href}>去查找 →</Link></article>)}</div><section className="article-index"><div className="section-heading"><div><div className="section-kicker">READ THE ARTICLES</div><h2>从一篇具体文章开始。</h2></div><span className="quiet-link">{learnArticles.length} 篇已上线</span></div><div className="article-index-list">{learnArticles.map((article, index) => <Link className="article-index-row" href={`/learn/${article.slug}`} key={article.slug}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{article.title}</h3><p>{article.summary}</p></div><b>阅读 →</b></Link>)}</div></section><section className="article-samples"><div className="section-heading"><div><div className="section-kicker">TRY A REAL RECORD</div><h2>把变量放在一起看。</h2></div><Link className="quiet-link" href="/hosiery">找更多记录 →</Link></div><div className="featured-grid">{samples.map((item) => <HosieryCard item={item} key={item.code} source="learn" />)}</div></section></main></>;
}


