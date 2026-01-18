import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/editor.css";

// Mock data to simulate different content for sections
const SECTION_CONTENT = [
  "<h2>1. Abstract</h2><p>This is the summary of the entire project...</p>",
  "<h2>2. Introduction</h2><p>The introduction sets the stage for the project...</p>",
  "<h2>3. Literature Review</h2><p>Existing solutions include...</p>",
  "<h2>4. Methodology</h2><p>We used the following approach...</p>",
  "<h2>5. Conclusion</h2><p>In conclusion, the results show...</p>",
];

const SECTIONS = ["Abstract", "Introduction", "Literature Review", "Methodology", "Conclusion"];

export default function Editor() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
  // State
  const [activeSection, setActiveSection] = useState(1); // Default to Introduction (index 1)
  const [latexOpen, setLatexOpen] = useState(false);
  const [latexInput, setLatexInput] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Design and Implementation of AI System");

  // Load content when activeSection changes
  useEffect(() => {
    if (editorRef.current) {
      // In a real app, you would fetch this from a DB based on the section ID
      editorRef.current.innerHTML = SECTION_CONTENT[activeSection] || "<p>Start typing...</p>";
    }
  }, [activeSection]);

  // Handle basic formatting (Bold, Italic)
  const formatDoc = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Handle inserting LaTeX
  const insertLatex = () => {
    if (!latexInput) return;
    
    // Focus the editor before inserting
    editorRef.current?.focus();
    
    // Insert the LaTeX formatted as code or specific text
    // Note: To render real Math, you'd need a library like KaTeX later.
    document.execCommand("insertText", false, ` $${latexInput}$ `);
    
    setLatexInput("");
    setLatexOpen(false);
  };

  const handleSave = () => {
    const currentContent = editorRef.current.innerHTML;
    console.log("Saving content for section", activeSection, ":", currentContent);
    alert("Section saved!");
  };

  const handleLogout = () => {
    // Clear tokens/session here
    navigate("/"); // Redirect to landing or login
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/dashboard">
            <i className="fa-solid fa-graduation-cap" /> Report<strong>Assist</strong>
          </Link>
        </div>

        <div className="nav-central-links">
          <Link to="/dashboard" className="nav-link">
            <i className="fa-solid fa-house" /> Dashboard
          </Link>

          <Link to="/templates" className="nav-link">
            <i className="fa-solid fa-layer-group" /> Templates
          </Link>

          <div className="doc-title">
            <span className="badge">PFE Report</span>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="actions">
            <button className="btn btn-outline" onClick={handleSave}>
              <i className="fa-solid fa-floppy-disk" /> Save
            </button>

            <button className="btn btn-primary" onClick={() => console.log("Exporting PDF...")}>
              <i className="fa-solid fa-file-export" /> Export
            </button>

            <Link to="/profile" className="user-profile-anchor">
              <img
                src="https://ui-avatars.com/api/?name=Student+User&background=3b82f6&color=fff"
                alt="User"
                className="avatar-img"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN EDITOR LAYOUT */}
      <div className="main-container">
        {/* SIDEBAR SECTIONS */}
        <aside className="sidebar">
          <ul className="section-list">
            {SECTIONS.map((sectionName, index) => (
              <li
                key={index}
                className={`section-item ${index === activeSection ? "active" : ""}`}
                onClick={() => setActiveSection(index)}
              >
                {sectionName}
              </li>
            ))}
          </ul>

          <button className="btn btn-outline logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" /> Logout
          </button>
        </aside>

        {/* EDITOR AREA */}
        <main className="editor-wrapper">
          <div className="toolbar">
            <button 
              className="tool-btn" 
              onClick={() => formatDoc("bold")} 
              title="Bold"
            >
              <i className="fa-solid fa-bold" />
            </button>

            <button 
              className="tool-btn" 
              onClick={() => formatDoc("italic")} 
              title="Italic"
            >
              <i className="fa-solid fa-italic" />
            </button>

            <button 
              className="tool-btn" 
              onClick={() => formatDoc("underline")} 
              title="Underline"
            >
              <i className="fa-solid fa-underline" />
            </button>

            <div className="divider" />

            <button 
              className="tool-btn" 
              onClick={() => setLatexOpen(true)}
              title="Insert Math Formula"
            >
              <i className="fa-solid fa-square-root-variable" /> LaTeX
            </button>
          </div>

          <div className="paper">
            <div
              ref={editorRef}
              id="editor"
              contentEditable
              suppressContentEditableWarning={true}
              spellCheck={false}
              className="editor-content"
            />
          </div>
        </main>
      </div>

      {/* LATEX MODAL */}
      {latexOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
               <h3>Insert Mathematical Formula</h3>
               <button className="close-btn" onClick={() => setLatexOpen(false)}>
                 <i className="fa-solid fa-xmark"></i>
               </button>
            </div>
            
            <textarea 
              placeholder="e.g. E = mc^2" 
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
              autoFocus
            />
            
            <div className="modal-footer">
              <button 
                className="btn btn-outline" 
                onClick={() => setLatexOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={insertLatex}
              >
                Insert Formula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}