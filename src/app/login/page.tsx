import { LoginPanel } from "@/components/LoginPanel";

export default function LoginPage() {
  return <main className="page-main"><div className="shell narrow"><span className="eyebrow">Member access</span><h1>Sign in to <em>HosieryLab.</em></h1><p className="lead">使用邮箱接收一次性登录链接，不需要记密码。</p><LoginPanel /></div></main>;
}
