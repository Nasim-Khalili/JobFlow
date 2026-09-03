import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">J</span><span>JobFlow</span></div>
        <nav className="nav-links">
          <NavLink to="/dashboard">Overview</NavLink>
          <NavLink to="/jobs">All jobs</NavLink>
          <NavLink className="nav-create" to="/jobs/create">+ Create job</NavLink>
        </nav>
        <button className="logout" onClick={handleLogout}>Log out <span>↗</span></button>
      </aside>
      <main className="main-content"><Outlet /></main>
    </div>
  );
}
