import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/dashboard.css"; // Assuming shared sidebar styles are here

export default function Layout() {
  const location = useLocation();

  // Helper to check if a link is active for styling
  const isActive = (path) => location.pathname === path ? "active" : "";

  const user = {
    name: "Student User",
    role: "Premium Account",
    avatar: "https://ui-avatars.com/api/?name=Student+User&background=3b82f6&color=fff"
  };

  return (
    <div className="dashboard-container">
      {/* SHARED SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="logo">
          <i className="fa-solid fa-graduation-cap" /> Report<strong>Assist</strong>
        </div>

        <nav className="side-nav">
          <Link to="/dashboard" className={`nav-item ${isActive("/dashboard")}`}>
            <i className="fa-solid fa-house" /> My Projects
          </Link>

          <Link to="/templates" className={`nav-item ${isActive("/templates")}`}>
            <i className="fa-solid fa-layer-group" /> Templates
          </Link>

          <Link to="/settings" className={`nav-item ${isActive("/settings")}`}>
            <i className="fa-solid fa-gear" /> Settings
          </Link>
        </nav>

        <div className="user-card">
          <img src={user.avatar} alt="User" />
          <div className="user-info">
            <Link to="/profile" className="user-profile-anchor">
              <span className="name">{user.name}</span>
            </Link>
            <span className="role">{user.role}</span>
          </div>
        </div>
      </aside>

      {/* PAGE CONTENT GOES HERE */}
      <main className="dash-content">
        <Outlet /> 
      </main>
    </div>
  );
}