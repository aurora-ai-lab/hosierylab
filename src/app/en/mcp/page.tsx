import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function EnglishMcpPage() {
  return <><SiteHeader locale="en" /><main className="shell page-main mcp-page">
    <div className="mcp-hero"><div><p className="eyebrow">DEVELOPER ACCESS</p><h1>Connect HosieryLab to your AI.</h1><p>Use MCP to read the public hosiery catalog, filters and full prompts. Customers need their own MCP key, never Cloudflare or R2 credentials.</p><div className="hero-actions"><Link className="button button-dark" href="/en/account">Create an MCP key ↗</Link><Link className="quiet-link" href="/en/guide">Read the guide</Link></div></div><div className="mcp-endpoint"><span>MCP ENDPOINT</span><strong>https://mcp.hosierylab.com/mcp</strong><small>A workers.dev fallback is available while DNS propagates.</small></div></div>
    <section className="mcp-steps"><article><b>01</b><h2>Sign in</h2><p>Use Google or a one-time email link on your account page.</p></article><article><b>02</b><h2>Create a key</h2><p>Create one key per client. The plaintext is shown once and can be revoked.</p></article><article><b>03</b><h2>Paste the config</h2><p>Add the MCP URL and Authorization header to your AI client.</p></article></section>
    <section className="mcp-config"><div><p className="section-kicker">REMOTE STREAM HTTP</p><h2>Connection config</h2><p>The server performs tool calls. Your key authorizes access without exposing storage credentials.</p></div><pre><code>{`{
  "mcpServers": {
    "hosierylab": {
      "url": "https://mcp.hosierylab.com/mcp",
      "headers": {
        "Authorization": "Bearer hlm_your_key"
      }
    }
  }
}`}</code></pre></section>
  </main></>;
}
