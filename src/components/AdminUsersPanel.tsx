"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

type User = { id: number; email: string; created_at: number; last_login: number | null };
const AUTH_URL = "https://auth.hosierylab.com";
function date(value: number | null) { return value ? new Date(value * 1000).toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" }) : "—"; }

export function AdminUsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("正在验证管理员权限…");
  async function load(search = "") {
    const response = await fetch(`${AUTH_URL}/admin/users${search ? `?q=${encodeURIComponent(search)}` : ""}`, { credentials: "include" });
    const data = await response.json();
    if (response.status === 401) { setStatus("请先登录后再打开此页面。"); return; }
    if (response.status === 403) { setStatus("当前账号没有管理员权限。"); return; }
    if (!response.ok) { setStatus("管理数据暂时无法加载。"); return; }
    setUsers(data.users || []); setStatus(`${data.users?.length || 0} 个用户`);
  }
  useEffect(() => { load(); }, []);
  return <div className="admin-panel"><div className="admin-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索邮箱" /><button className="button button-dark" onClick={() => load(query)}>搜索</button></div><p className="auth-message">{status}</p>{users.length > 0 && <div className="admin-table"><div className="admin-row admin-head"><span>邮箱</span><span>注册时间</span><span>最后登录</span></div>{users.map((user) => <div className="admin-row" key={user.id}><strong>{user.email}</strong><span>{date(user.created_at)}</span><span>{date(user.last_login)}</span></div>)}</div>}</div>;
}

