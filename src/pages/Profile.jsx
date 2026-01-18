import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css";

export default function Profile() {
  // State for user details (simulating fetched data)
  const [user, setUser] = useState({
    name: "Student User",
    role: "Premium Account",
    email: "student@university.edu",
    major: "Computer Science Student | Class of 2025",
    avatar: "https://ui-avatars.com/api/?name=Student+User&size=128&background=3b82f6&color=fff"
  });

  return (
    <div className="dashboard-container">
      {/* SIDEBAR (Should ideally be in a Layout component) */}
      

      {/* MAIN CONTENT */}
      <main className="dash-content">
        <header className="profile-header">
          <div className="profile-cover" />

          <div className="profile-info-bar">
            <div className="profile-main">
              <img
                src={user.avatar}
                alt="Profile"
                className="large-avatar"
              />

              <div className="text">
                <h1>{user.name}</h1>
                <p>{user.major}</p>
              </div>
            </div>

            <div className="header-actions">
              <button className="btn btn-outline">
                <i className="fa-solid fa-pen" /> Edit Profile
              </button>
            </div>
          </div>
        </header>

        <div className="profile-grid">
          {/* LEFT COLUMN */}
          <div className="profile-left">
            <section className="stats-card">
              <h3>Writing Statistics</h3>
              <div className="stats-row">
                <StatBox label="Total Words" value="45.2k" />
                <StatBox label="Reports Created" value="12" />
                <StatBox label="Hours Written" value="158" />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="profile-right">
            <section className="settings-card">
              <div className="card-title">
                <i className="fa-solid fa-clock-rotate-left" />
                <h3>Recent Activity</h3>
              </div>

              <ul className="activity-list">
                <ActivityItem
                  icon="fa-file-pdf"
                  title="Exported"
                  text="AI System Design as PDF"
                  time="2 hours ago"
                />
                <ActivityItem
                  icon="fa-floppy-disk"
                  title="Saved Draft"
                  text="Internship Report"
                  time="Yesterday at 18:45"
                />
              </ul>
            </section>

            <section className="settings-card danger-zone">
              <div className="card-title">
                <i className="fa-solid fa-shield-halved" />
                <h3>Account & Security</h3>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-disabled"
                />
              </div>

              <button
                className="btn btn-outline btn-danger"
                style={{ marginTop: 15 }}
              >
                Change Password
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components

function StatBox({ label, value }) {
  return (
    <div className="stat-box">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function ActivityItem({ icon, title, text, time }) {
  return (
    <li className="activity-item">
      <div className="activity-icon">
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="activity-details">
        <h4>{title}</h4>
        <p>{text}</p>
        <span className="time">{time}</span>
      </div>
    </li>
  );
}