import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & licensing | HosieryLab",
  description: "Usage notes and licensing guidance for HosieryLab synthetic references and prompts.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <main className="shell content-page"><Link className="back-link" href="/">← 返回 HosieryLab</Link><p className="eyebrow">使用条款与授权</p><h1>请负责任地使用这些参考。</h1><p className="content-lede">HosieryLab 记录是用于设计、研究和提示词开发的结构化视觉参考。</p><section className="detail-section"><h2>合成图像</h2><p>除非记录另有说明，目录图片都是合成视觉参考。它们不是指定人物的照片，也不能被当作文献证据或真实商品图片。</p><h2>提示词使用</h2><p>你可以将提示词用于个人创作、学习、原型和内部开发。商业项目、付费服务、批量交付或再销售前，请先取得相应授权，并保留记录中的来源与限制说明。</p><h2>内容边界</h2><p>不得用这些材料描绘未成年人、未经许可的真实人物，或把受版权保护的角色呈现为官方授权。生成的时装场景必须保持非露骨并明确为成年人。</p><h2>问题与授权</h2><p>如需商业授权、批量许可或再发布许可，请先联系 HosieryLab 运营者。</p></section></main>;
}
