import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "隐私政策 · HosieryLab", description: "HosieryLab 的隐私政策与数据说明。", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <main className="shell content-page"><Link className="back-link" href="/">← 返回 HosieryLab</Link><p className="eyebrow">隐私政策</p><h1>只收集让实验室变得更清楚的数据。</h1><p className="content-lede">本页面说明 HosieryLab 如何处理访问、复制提示词和站点改进相关的数据。</p><section className="detail-section"><h2>我们收集什么</h2><p>站点可能收集匿名的页面访问、搜索、筛选和提示词复制事件，用于了解哪些功能有用。复制内容本身不会被发送给我们。</p><h2>分析服务</h2><p>如果启用站点统计，我们使用 Plausible 记录聚合访问数据，不使用跨站追踪广告，也不建立个人画像。浏览器的“请勿追踪”或减少追踪设置会被尊重。</p><h2>本地数据</h2><p>动效偏好和首次开屏状态保存在你的浏览器本地存储中。清除站点数据即可删除这些设置。</p><h2>第三方资源</h2><p>图片与静态资源可能由 Cloudflare R2 和 CDN 提供。它们只为完成页面加载而处理必要的请求信息。</p><h2>联系我们</h2><p>如需了解、修改或删除与站点交互有关的数据，请通过站点运营者提供的联系方式联系。</p></section></main>;
}
