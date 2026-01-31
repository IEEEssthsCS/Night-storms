import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react"; // 1. Import Hooks
import "../styles/dashboard.css"; 

export default function Layout() {
  const location = useLocation();

  // Helper to check if a link is active for styling
  const isActive = (path) => location.pathname === path ? "active" : "";

  // 2. Set default state (Fallback if no user is logged in)
  const [user, setUser] = useState({
    firstName: "Student",
    lastName: "User",
    role: "Premium Account"
  });

  // 3. Load user from LocalStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Parse string back to object
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  // 4. Create dynamic full name and avatar URL
  const fullName = `${user.firstName} ${user.lastName}`;
  // This API creates an image with initials (e.g. "John Doe" -> "JD")
  const avatarUrl = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff`;

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
          {/* Use dynamic avatar */}
          <img src={avatarUrl} alt="User" />
          
          <div className="user-info">
            <Link to="/profile" className="user-profile-anchor">
              {/* Use dynamic name */}
              <span className="name">{fullName}</span>
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