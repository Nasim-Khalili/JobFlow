import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, login } from "../services/auth";

export default function Login() {
  const navigate = useNavigate(); const location = useLocation();
  const [username, setUsername] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const tokens = await login(username.trim(), password);
      localStorage.setItem("access_token", tokens.access); localStorage.setItem("refresh_token", tokens.refresh);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch { setError("Invalid username or password. Please try again."); } finally { setLoading(false); }
  };
  return <div className="login-page"><section className="login-visual"><div className="brand light"><span className="brand-mark">J</span><span>JobFlow</span></div><div><p className="eyebrow">BACKGROUND PROCESSING, CLEARLY</p><h1>Move data work<br /><em>forward.</em></h1><p className="visual-copy">Upload, process, and monitor every job from one calm command center.</p></div><div className="visual-footer">JOBFLOW / 2026</div></section><section className="login-panel"><div className="login-form"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to JobFlow</h2><p className="muted">Your processing workspace is ready.</p><form onSubmit={submit}><label>Username<input required value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label><label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{error && <div className="alert alert-error">{error}</div>}<button className="primary-button full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}<span>→</span></button></form></div></section></div>;
}