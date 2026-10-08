import { SiteHeader } from "@/components/SiteHeader";
import { McpKeysPanel } from "@/components/McpKeysPanel";

export default function AccountPage() { return <><SiteHeader /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">ACCOUNT</p><h1>你的账户。</h1><p>登录后创建、复制和撤销自己的 MCP 密钥。</p></div></div><McpKeysPanel /></main></>; }
