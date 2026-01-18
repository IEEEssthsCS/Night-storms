import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // 1. Manage local UI state (e.g., toggling between grid and list view)
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // 2. Dummy data for projects (Simulating an API response)
  const recentProjects = [
    { id: 1, type: "PFE", title: "AI System Design", progress: 75, date: "2 days ago" },
    { id: 2, type: "Internship", title: "Web Dev Report", progress: 30, date: "5 days ago" },
  ];

  return (
    <div className="dashboard-container">

      {/* MAIN CONTENT */}
      <main className="dash-content">
        <header className="dash-header">
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder="Search your reports..." />
          </div>

          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/main")}
            >
              <i className="fa-solid fa-plus" /> New Report
            </button>
          </div>
        </header>

        <section className="projects-section">
          <div className="section-title">
            <h2>Recent Projects</h2>
            <div className="view-toggle">
              <i 
                className={`fa-solid fa-grip ${viewMode === 'grid' ? 'active' : ''}`} 
                onClick={() => setViewMode("grid")}
                role="button"
              />
              <i 
                className={`fa-solid fa-list ${viewMode === 'list' ? 'active' : ''}`} 
                onClick={() => setViewMode("list")}
                role="button"
              />
            </div>
          </div>

          <div className={`project-grid ${viewMode}`}>
            {/* 3. Render projects dynamically */}
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} data={project} />
            ))}

            {/* "Add New" Card */}
            <div
              className="project-card add-card"
              onClick={() => navigate("/main")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate("/main")}
            >
              <i className="fa-solid fa-circle-plus" />
              <span>Create New Report</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// 4. Internal Component Definition
// (In a larger app, move this to src/components/ProjectCard.jsx)
function ProjectCard({ data }) {
  return (
    <div className="project-card">
      <div className="card-header">
        <span className={`badge badge-${data.type.toLowerCase()}`}>{data.type}</span>
        <i className="fa-solid fa-ellipsis-vertical action-icon" />
      </div>
      
      <h3>{data.title}</h3>
      <p className="card-date">Last edited: {data.date}</p>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${data.progress}%` }} 
          />
        </div>
        <span className="progress-text">{data.progress}%</span>
      </div>
    </div>
  );
}