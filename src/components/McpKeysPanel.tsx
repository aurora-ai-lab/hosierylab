"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

const AUTH = "https://auth.hosierylab.com";
type KeyRecord = { id: number; name: string; key_prefix: string; created_at: number; last_used_at: number | null; revoked_at: number | null };

export function McpKeysPanel({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const en = locale === "en";
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState(en ? "My MCP client" : "我的 MCP 客户端");
  const [newKey, setNewKey] = useState("");
  const [status, setStatus] = useState(en ? "Loading…" : "正在读取账户…");
  const date = (value: number | null) => value ? new Date(value * 1000).toLocaleString(en ? "en-US" : "zh-CN") : (en ? "Never" : "未使用");

  async function load() {
    const me = await fetch(`${AUTH}/auth/me`, { credentials: "include" }).then((r) => r.ok ? r.json() : null).catch(() => null);
    setEmail(me?.user?.email ?? null);
    if (!me?.user) { setStatus(en ? "Sign in first to manage MCP keys." : "请先登录，再管理 MCP 密钥。"); return; }
    const response = await fetch(`${AUTH}/account/mcp-keys`, { credentials: "include" }).catch(() => null);
    const data = response?.ok ? await response.json() : null;
    setKeys(data?.keys ?? []); setStatus("");
  }
  useEffect(() => { void load(); }, []);
  async function create() {
    setStatus(en ? "Creating…" : "正在创建…"); setNewKey("");
    const response = await fetch(`${AUTH}/account/mcp-keys`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setStatus(en ? "Please sign in first." : "请先登录。 "); return; }
    setNewKey(data.key || ""); setStatus(en ? "Copy this key now. It will not be shown again." : "现在复制密钥；关闭后不会再次显示。"); await load();
  }
  async function revoke(id: number) {
    await fetch(`${AUTH}/account/mcp-keys/${id}`, { method: "POST", credentials: "include" }); await load();
  }
  return <section className="account-panel">
    <p className="eyebrow">{en ? "DEVELOPER ACCESS" : "开发者访问"}</p>
    <h2>{en ? "MCP keys" : "MCP 密钥"}</h2>
    <p className="account-muted">{email ? `${en ? "Signed in as" : "当前账户"} ${email}` : status}</p>
    {newKey && <div className="account-key-output"><strong>{newKey}</strong><button className="button button-dark" onClick={() => navigator.clipboard.writeText(newKey)}>{en ? "Copy key" : "复制密钥"}</button></div>}
    <div className="account-key-create"><input value={name} onChange={(e) => setName(e.target.value)} aria-label={en ? "Key name" : "密钥名称"} /><button className="button button-dark" onClick={create}>{en ? "Create key" : "创建密钥"}</button></div>
    {status && email && <p className="auth-message">{status}</p>}
    <div className="account-key-list">{keys.map((key) => <div className="account-key-row" key={key.id}><div><strong>{key.name}</strong><span>{key.key_prefix}… · {en ? "created" : "创建于"} {date(key.created_at)} · {en ? "last used" : "最后使用"} {date(key.last_used_at)}</span></div>{key.revoked_at ? <em>{en ? "Revoked" : "已撤销"}</em> : <button className="text-link" onClick={() => revoke(key.id)}>{en ? "Revoke" : "撤销"}</button>}</div>)}</div>
  </section>;
}

