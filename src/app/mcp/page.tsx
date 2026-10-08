import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function McpPage() {
  return <><SiteHeader /><main className="shell page-main mcp-page">
    <div className="mcp-hero"><div><p className="eyebrow">DEVELOPER ACCESS</p><h1>把 HosieryLab 接入你的 AI。</h1><p>用 MCP 读取公开丝袜资料、筛选结果和完整提示词。客户只需要自己的 MCP 密钥，不需要 Cloudflare 或 R2 凭证。</p><div className="hero-actions"><Link className="button button-dark" href="/account">创建 MCP 密钥 ↗</Link><Link className="quiet-link" href="/guide">查看使用说明</Link></div></div><div className="mcp-endpoint"><span>MCP ENDPOINT</span><strong>https://mcp.hosierylab.com/mcp</strong><small>DNS 生效前也可使用 workers.dev 备用地址。</small></div></div>
    <section className="mcp-steps"><article><b>01</b><h2>登录</h2><p>使用 Google 或邮箱一次性登录账户页。</p></article><article><b>02</b><h2>生成密钥</h2><p>为每个客户端创建独立密钥。明文只显示一次，可以随时撤销。</p></article><article><b>03</b><h2>粘贴配置</h2><p>把 MCP 地址和 Authorization 请求头填入你的 AI 客户端。</p></article></section>
    <section className="mcp-config"><div><p className="section-kicker">REMOTE STREAM HTTP</p><h2>连接配置</h2><p>工具调用由服务器完成，客户密钥只用于授权，不会获得底层存储凭证。</p></div><pre><code>{`{
  "mcpServers": {
    "hosierylab": {
      "url": "https://mcp.hosierylab.com/mcp",
      "headers": {
        "Authorization": "Bearer hlm_你的密钥"
      }
    }
  }
}`}</code></pre></section>
  </main></>;
}
