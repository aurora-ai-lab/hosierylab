"use client";
import { FormEvent, useEffect, useState } from "react";

const AUTH_URL = "https://auth.hosierylab.com";

export function LoginPanel() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`${AUTH_URL}/auth/me`, { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((data) => setUser(data?.user ?? null)).catch(() => undefined);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`${AUTH_URL}/auth/request`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      setMessage(response.ok ? "登录链接已发送，请检查邮箱。" : (data.error === "invalid_email" ? "请输入有效邮箱。" : "发送失败，请稍后重试。"));
    } catch { setMessage("服务暂时不可用，请稍后重试。"); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch(`${AUTH_URL}/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null); setMessage("已退出登录。");
  }

  if (user) return <div className="auth-card"><p>当前登录：<strong>{user.email}</strong></p><button className="button button-dark" onClick={logout}>退出登录</button></div>;
  return <div className="auth-card"><a className="button button-dark auth-google" href={`${AUTH_URL}/oauth/google/start`}>使用 Google 登录</a><div className="auth-divider">或使用邮箱</div><form onSubmit={submit}><label htmlFor="email">邮箱地址</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /><button className="button button-dark" disabled={busy}>{busy ? "发送中…" : "发送登录链接"}</button>{message && <p className="auth-message" role="status">{message}</p>}</form></div>;
}

