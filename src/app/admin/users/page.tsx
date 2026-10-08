import { AdminUsersPanel } from "@/components/AdminUsersPanel";

export default function AdminUsersPage() {
  return <main className="page-main"><div className="shell narrow"><span className="eyebrow">ADMIN / USERS</span><h1>User <em>directory.</em></h1><p className="lead">查看注册用户、注册时间和最近登录时间。</p><AdminUsersPanel /></div></main>;
}
