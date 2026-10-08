import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = { title: "更新日志 · HosieryLab", description: "HosieryLab 数据批次、风格页面和使用功能的更新记录。", alternates: { canonical: "/changelog" } };

const entries = [
  ["2026.10.07", "导航与内容入口", "加入找丝袜、风格、用法、丝袜百科；移动端改为菜单式导航；移除客户界面的对比按钮。", "/guide"],
  ["2026.10.07", "双批次目录", "A、B 两批共 2000 条记录，图片、三层提示词和元数据保持一一对应，并写入网站与 R2。", "/hosiery"],
  ["2026.10.06", "统一视觉参考", "首页加入 5D–100D 对比图，展示图使用独立 HOSIERYLAB.COM 水印。", "/"],
];

export default function ChangelogPage() { return <><SiteHeader /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">CHANGELOG</p><h1>每次更新，<em>都留有记录。</em></h1><p>记录发布批次、页面入口和数据结构变化，方便从一条更新回到对应内容。</p></div><div className="intro-stat"><strong>{entries.length}</strong><span>recent updates</span></div></div><div className="changelog-list">{entries.map(([date, title, description, href]) => <article className="changelog-row" key={date + title}><time>{date}</time><div><h2>{title}</h2><p>{description}</p></div><Link className="text-link" href={href}>查看 →</Link></article>)}</div></main></>;
}
