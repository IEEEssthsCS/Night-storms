import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
// Make sure this imports the new CSS file above
import "../styles/editor.css"; 

const INITIAL_CONTENT = `
<h2 id="abstract">1. Abstract</h2>
<p>This report presents a comprehensive study on the design and implementation of an AI system. The research explores fundamental concepts, methodologies, and practical applications in the field of artificial intelligence.</p>

<h2 id="introduction">2. Introduction</h2>
<p>Artificial Intelligence has emerged as one of the most transformative technologies of the 21st century. The primary objective of this study is to design and implement a robust AI system capable of addressing real-world problems.</p>
<p>The scope of this research encompasses multiple dimensions of AI development, including data processing, algorithm selection, model training, and performance evaluation.</p>

<h2 id="literature">3. Literature Review</h2>
<p>Early research in the field focused on rule-based systems and symbolic AI approaches. More recent work has shifted toward machine learning and deep learning paradigms, which have demonstrated superior performance across a wide range of applications.</p>

<h2 id="methodology">4. Methodology</h2>
<p>This section describes the research methodology employed in this study. Our approach follows a systematic process encompassing data collection, preprocessing, model development, and evaluation.</p>
<p>The data collection phase involved gathering relevant datasets from multiple sources, ensuring diversity and representativeness.</p>

<h2 id="conclusion">5. Conclusion</h2>
<p>In conclusion, this research has successfully demonstrated the design and implementation of an effective AI system. The results validate our methodological approach and confirm the viability of our proposed solution.</p>
`;

const SECTIONS = [
  { id: "abstract", name: "Abstract" },
  { id: "introduction", name: "Introduction" },
  { id: "literature", name: "Literature Review" },
  { id: "methodology", name: "Methodology" },
  { id: "conclusion", name: "Conclusion" }
];

export default function Editor() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
   
  const [latexOpen, setLatexOpen] = useState(false);
  const [latexInput, setLatexInput] = useState("");
  const [displayMode, setDisplayMode] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("Design and Implementation of AI System");
   
  const [user, setUser] = useState({ firstName: "Student", lastName: "User" });

  useEffect(() => {
    // Load initial content only once
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = INITIAL_CONTENT;
    }

    // Load user for the Navbar
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Handle paste to constrain image width
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          const reader = new FileReader();
           
          reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            img.style.display = 'block';
            img.style.margin = '10px auto';
             
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(img);
              range.setStartAfter(img);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          };
           
          reader.readAsDataURL(blob);
          break;
        }
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('paste', handlePaste);
      return () => editor.removeEventListener('paste', handlePaste);
    }
  }, []);

  const formatDoc = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLatex = () => {
    if (!latexInput.trim()) {
      alert("Please enter a LaTeX formula");
      return;
    }
    
    try {
      const renderedMath = katex.renderToString(latexInput, {
        throwOnError: false,
        displayMode: displayMode
      });

      const uniqueId = `latex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const formulaHtml = displayMode
        ? `<div class="rendered-latex-block draggable-latex" draggable="true" contenteditable="false" data-latex="${latexInput.replace(/"/g, '&quot;')}" id="${uniqueId}">
             <div class="latex-drag-handle" title="Drag to move">⋮⋮</div>
             ${renderedMath}
           </div><p><br></p>`
        : `<span class="rendered-latex-inline draggable-latex" draggable="true" contenteditable="false" data-latex="${latexInput.replace(/"/g, '&quot;')}" id="${uniqueId}">
             ${renderedMath}
           </span>&nbsp;`;
      
      editorRef.current?.focus();
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const temp = document.createElement('div');
        temp.innerHTML = formulaHtml;
        const fragment = document.createDocumentFragment();
        let lastNode;
        
        while (temp.firstChild) {
          lastNode = fragment.appendChild(temp.firstChild);
        }
        
        range.insertNode(fragment);
        
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      
      setLatexInput("");
      setDisplayMode(false);
      setLatexOpen(false);
    } catch (err) {
      console.error("LaTeX error:", err);
      alert("Invalid LaTeX syntax. Please check your formula.");
    }
  };

  // Handle drag and drop for LaTeX elements
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    let draggedElement = null;
    let placeholder = null;

    const handleDragStart = (e) => {
      if (e.target.classList.contains('draggable-latex')) {
        draggedElement = e.target;
        e.target.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        
        placeholder = document.createElement('div');
        placeholder.className = 'latex-drop-placeholder';
        placeholder.style.height = e.target.offsetHeight + 'px';
        placeholder.style.border = '2px dashed #c5a059'; // Gold dashed line
      }
    };

    const handleDragEnd = (e) => {
      if (e.target.classList.contains('draggable-latex')) {
        e.target.style.opacity = '1';
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      if (!draggedElement) return;

      const afterElement = getDragAfterElement(editor, e.clientY);
      
      if (afterElement == null) {
        if (placeholder) editor.appendChild(placeholder);
      } else {
        if (placeholder && afterElement !== placeholder) {
          editor.insertBefore(placeholder, afterElement);
        }
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!draggedElement) return;

      const afterElement = getDragAfterElement(editor, e.clientY);
      
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }

      if (afterElement == null) {
        editor.appendChild(draggedElement);
      } else {
        editor.insertBefore(draggedElement, afterElement);
      }

      draggedElement.style.opacity = '1';
      draggedElement = null;
    };

    const getDragAfterElement = (container, y) => {
      const draggableElements = [...container.querySelectorAll('.draggable-latex:not(.dragging), p, h2, div:not(.latex-drop-placeholder)')];

      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    editor.addEventListener('dragstart', handleDragStart);
    editor.addEventListener('dragend', handleDragEnd);
    editor.addEventListener('dragover', handleDragOver);
    editor.addEventListener('drop', handleDrop);

    return () => {
      editor.removeEventListener('dragstart', handleDragStart);
      editor.removeEventListener('dragend', handleDragEnd);
      editor.removeEventListener('dragover', handleDragOver);
      editor.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleLatexKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      insertLatex();
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
       
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.margin = '10px auto';
         
        editorRef.current?.focus();
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          range.setStartAfter(img);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      };
       
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const currentContent = editorRef.current.innerHTML;
    console.log("Saving document:", currentContent);
    alert("Document saved!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = editorRef.current.innerHTML;
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${documentTitle}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@700&display=swap");
          body { font-family: 'Crimson Text', serif; max-width: 210mm; margin: 0 auto; padding: 20px; line-height: 1.6; color: #2b2b2b; }
          h2 { font-family: 'Cinzel', serif; color: #2c241b; border-bottom: 2px solid #c5a059; padding-bottom: 5px; margin-top: 30px; }
          img { max-width: 100%; height: auto; display: block; margin: 10px auto; filter: sepia(0.2); }
          .rendered-latex-block { text-align: center; margin: 20px 0; }
          @page { size: A4; margin: 25mm; }
        </style>
      </head>
      <body>
        <h1 style="text-align: center; font-family: 'Cinzel', serif; color: #2c241b; margin-bottom: 40px;">${documentTitle}</h1>
        ${content}
      </body>
      </html>
    `;
     
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.replace(/[^a-z0-9]/gi, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=c5a059&color=2c241b`;

  return (
    <>
      <nav className="navbar no-print">
        <div className="logo">
          <Link to="/dashboard">
            <i className="fa-solid fa-graduation-cap" /> Report<strong>Assist</strong>
          </Link>
        </div>

        <div className="nav-central-links">
          <Link to="/dashboard" className="nav-link"><i className="fa-solid fa-house" /> Dashboard</Link>
          <Link to="/templates" className="nav-link"><i className="fa-solid fa-layer-group" /> Templates</Link>

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
            <button className="btn btn-primary" onClick={handlePrint}>
              <i className="fa-solid fa-print" /> Print
            </button>
            <button className="btn btn-primary" onClick={handleDownload}>
              <i className="fa-solid fa-download" /> Download
            </button>

            <Link to="/profile" className="user-profile-anchor">
              <img src={avatarUrl} alt="User" className="avatar-img" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="main-container">
        <aside className="sidebar no-print">
          <ul className="section-list">
            {SECTIONS.map((section) => (
              <li
                key={section.id}
                className="section-item"
                onClick={() => scrollToSection(section.id)}
              >
                {section.name}
              </li>
            ))}
          </ul>
          <button className="btn btn-outline logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" /> Logout
          </button>
        </aside>

        <main className="editor-wrapper">
          <div className="toolbar no-print">
            <button className="tool-btn" onClick={() => formatDoc("bold")} title="Bold"><i className="fa-solid fa-bold" /></button>
            <button className="tool-btn" onClick={() => formatDoc("italic")} title="Italic"><i className="fa-solid fa-italic" /></button>
            <button className="tool-btn" onClick={() => formatDoc("underline")} title="Underline"><i className="fa-solid fa-underline" /></button>
            <div className="divider" />
            <button className="tool-btn" onClick={() => setLatexOpen(true)} title="Insert Math Formula">
              <i className="fa-solid fa-square-root-variable" />
            </button>
            <button className="tool-btn" onClick={handleImageUpload} title="Insert Image">
              <i className="fa-solid fa-image" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="paper-container">
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
          </div>
        </main>
      </div>

      {latexOpen && (
        <div className="modal-overlay" onClick={() => setLatexOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Insert Mathematical Formula</h3>
              <button className="btn btn-outline" style={{border:'none', color:'#c5a059'}} onClick={() => setLatexOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
             
            <div className="modal-body">
              <textarea 
                placeholder="e.g. \frac{a}{b} or E=mc^2 or \int_{0}^{\infty} x^2 dx" 
                value={latexInput}
                onChange={(e) => setLatexInput(e.target.value)}
                onKeyDown={handleLatexKeyPress}
                autoFocus
                rows={4}
              />
               
              {latexInput && (
                <div className="latex-preview">
                  <strong>Preview:</strong>
                  <div 
                    style={{ 
                      marginTop: '10px', 
                      padding: '10px', 
                      backgroundColor: '#f5f5f5', 
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: displayMode ? 'center' : 'flex-start'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: (() => {
                        try {
                          return katex.renderToString(latexInput, {
                            throwOnError: false,
                            displayMode: displayMode
                          });
                        } catch {
                          return '<span style="color: #d32f2f;">Invalid LaTeX</span>';
                        }
                      })()
                    }}
                  />
                </div>
              )}
               
              <label style={{ display: 'flex', alignItems: 'center', marginTop: '12px', cursor: 'pointer', fontFamily: "Courier Prime" }}>
                <input 
                  type="checkbox" 
                  checked={displayMode}
                  onChange={(e) => setDisplayMode(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Display as block
              </label>
            </div>
             
            <div className="modal-footer">
              <button className="btn btn-outline" style={{color: '#333', borderColor: '#999'}} onClick={() => setLatexOpen(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{background: '#2c241b', color: '#c5a059', borderColor: '#2c241b'}}
                onClick={insertLatex}
                disabled={!latexInput.trim()}
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