import { useState } from "react";
import "../styles/settings.css";

export default function Settings() {
  // 1. Manage form state
  const [settings, setSettings] = useState({
    reportTitle: "Final Year Project Report",
    authorName: "Student User",
    academicYear: "2024/2025",
    darkMode: false,
    emailNotifications: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // 2. Generic handler for text/select inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Settings saved:", settings);
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  return (
    // Note: No Sidebar here, as it's handled by Layout.jsx
    <div className="dash-content"> 
      <header className="dash-header">
        <div className="header-info">
          <h1>Report Settings</h1>
          <p>Configure project metadata and document formatting defaults.</p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin" /> Saving...
            </>
          ) : (
            <>
              <i className="fa-solid fa-check" /> Save Changes
            </>
          )}
        </button>
      </header>

      <div className="settings-container">
        
        {/* CARD 1: General Info */}
        <section className="settings-card">
          <div className="card-title">
            <i className="fa-solid fa-file-pen" />
            <h3>General Information</h3>
          </div>
          
          <div className="form-group">
            <label>Default Report Title</label>
            <input 
              type="text" 
              name="reportTitle"
              value={settings.reportTitle}
              onChange={handleChange}
              placeholder="e.g. Internship Report" 
            />
          </div>

          <div className="form-group">
            <label>Author Name</label>
            <input 
              type="text" 
              name="authorName"
              value={settings.authorName}
              onChange={handleChange}
              placeholder="Your Name" 
            />
          </div>

          <div className="form-group">
            <label>Academic Year</label>
            <select 
              name="academicYear"
              value={settings.academicYear}
              onChange={handleChange}
            >
              <option value="2023/2024">2023/2024</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
            </select>
          </div>
        </section>

        {/* CARD 2: App Preferences */}
        <section className="settings-card">
          <div className="card-title">
            <i className="fa-solid fa-sliders" />
            <h3>Preferences</h3>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <span>Dark Mode</span>
              <small>Switch between light and dark themes</small>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <span>Email Notifications</span>
              <small>Receive updates about your templates</small>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </section>

      </div>
    </div>
  );
}