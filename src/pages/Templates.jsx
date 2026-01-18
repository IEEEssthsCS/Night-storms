import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/templates.css";

// 1. Define Template Data
const TEMPLATES = [
  {
    id: "pfe",
    title: "PFE / Master Thesis",
    desc: "Standard structure for final year engineering projects.",
    category: "Engineering",
    color: "#3b82f6" // Blue
  },
  {
    id: "internship",
    title: "Internship Report",
    desc: "Focused on professional experience and company analysis.",
    category: "Business",
    color: "#10b981" // Green
  },
  {
    id: "research",
    title: "IEEE Scientific Paper",
    desc: "Double-column format for journal submissions.",
    category: "Science",
    color: "#8b5cf6" // Purple
  },
  {
    id: "lab",
    title: "Lab Report",
    desc: "Structure for experimental data and analysis.",
    category: "Science",
    color: "#f59e0b" // Amber
  }
];

const CATEGORIES = ["All", "Engineering", "Business", "Science"];

export default function Templates() {
  const navigate = useNavigate();
  
  // 2. State for filtering
  const [activeFilter, setActiveFilter] = useState("All");

  // 3. Filter logic
  const filteredTemplates = activeFilter === "All" 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === activeFilter);

  const startWithTemplate = (type) => {
    // Navigate to Editor with the selected template type
    navigate(`/main?template=${type}`);
  };

  return (
    <div className="dash-content">
      <header className="dash-header">
        <div className="header-info">
          <h1>Report Templates</h1>
          <p>Select a structure to jumpstart your academic writing.</p>
        </div>
      </header>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TEMPLATE GRID */}
      <div className="template-grid">
        {filteredTemplates.map((template) => (
          <div 
            key={template.id} 
            className="template-card" 
            onClick={() => startWithTemplate(template.id)}
            role="button"
            tabIndex={0}
          >
            <div 
              className="template-preview" 
              style={{ backgroundColor: `${template.color}20` }} // 20% opacity background
            >
              {/* Decorative Icon based on category */}
              <i 
                className={`fa-solid ${getIcon(template.category)} template-icon`} 
                style={{ color: template.color }}
              />
              
              <div className="hover-overlay">
                <button className="btn btn-primary">Use This Template</button>
              </div>
            </div>
            
            <div className="template-info">
              <span className="template-cat">{template.category}</span>
              <h3>{template.title}</h3>
              <p>{template.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to pick an icon based on category
function getIcon(category) {
  switch (category) {
    case "Engineering": return "fa-microchip";
    case "Business": return "fa-briefcase";
    case "Science": return "fa-flask";
    default: return "fa-file-lines";
  }
}