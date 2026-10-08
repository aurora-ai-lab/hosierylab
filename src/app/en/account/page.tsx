import { SiteHeader } from "@/components/SiteHeader";
import { McpKeysPanel } from "@/components/McpKeysPanel";

export default function EnglishAccountPage() { return <><SiteHeader locale="en" /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">ACCOUNT</p><h1>Your account.</h1><p>Create, copy and revoke your own MCP keys after signing in.</p></div></div><McpKeysPanel locale="en" /></main></>; }
