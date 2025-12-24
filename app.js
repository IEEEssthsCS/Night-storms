/*************************************************
 * APP.JS — Editor & Auth UI Logic
 * Frontend prototype (mock auth)
 *************************************************/

/* ---------- AUTH FORMS ---------- */

document.addEventListener("DOMContentLoaded", () => {

    /* LOGIN FORM */
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();

            const username = document.getElementById("login-username").value.trim();
            const password = document.getElementById("login-password").value;

            if (!login(username, password)) {
                alert("Invalid username or password");
            }
        });
    }

    /* SIGNUP FORM */
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", e => {
            e.preventDefault();

            const username = document.getElementById("signup-username").value.trim();
            const password = document.getElementById("signup-password").value;

            if (!signup(username, password)) {
                alert("Username already exists");
            }
        });
    }

});


/* ---------- LOGIN / SIGNUP MODALS ---------- */

function openLoginModal() {
    document.getElementById("login-modal").style.display = "flex";
}

function closeLoginModal() {
    document.getElementById("login-modal").style.display = "none";
}

function openSignupModal() {
    document.getElementById("signup-modal").style.display = "flex";
}

function closeSignupModal() {
    document.getElementById("signup-modal").style.display = "none";
}


/* ---------- EDITOR TOOLBAR ---------- */

function formatDoc(command, value = null) {
    document.execCommand(command, false, value);
}


/* ---------- SECTIONS (OUTLINE) ---------- */

function loadSection(index) {
    const editor = document.getElementById("editor");
    if (!editor) return;

    const sections = [
        "<h2>Abstract</h2><p>Write your abstract here...</p>",
        "<h2>Introduction</h2><p>Write your introduction here...</p>",
        "<h2>Literature Review</h2><p>Discuss related work here...</p>",
        "<h2>Methodology</h2><p>Describe your methodology here...</p>",
        "<h2>Conclusion</h2><p>Summarize your conclusions here...</p>"
    ];

    editor.innerHTML = sections[index];

    document.querySelectorAll(".section-item").forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });
}


/* ---------- LATEX MODAL ---------- */

function openLatexModal() {
    document.getElementById("latex-modal").style.display = "flex";
}

function closeLatexModal() {
    document.getElementById("latex-modal").style.display = "none";
}

const latexInput = document.getElementById("latex-input");
const latexPreview = document.getElementById("latex-preview");

if (latexInput && latexPreview) {
    latexInput.addEventListener("input", () => {
        try {
            katex.render(latexInput.value, latexPreview, {
                throwOnError: false,
                trust: false,
                strict: "warn"
            });
        } catch {
            latexPreview.textContent = "Invalid LaTeX";
        }
    });
}

function insertLatex() {
    const latex = latexInput.value.trim();
    if (!latex) return;

    const span = document.createElement("span");
    katex.render(latex, span, {
        throwOnError: false,
        trust: false
    });

    const editor = document.getElementById("editor");
    editor.appendChild(span);

    latexInput.value = "";
    latexPreview.textContent = "";
    closeLatexModal();
}


/* ---------- SAVE (MOCK) ---------- */

function saveDocument() {
    if (!currentUser) {
        alert("Login required to save");
        return;
    }

    const content = document.getElementById("editor").innerHTML;
    localStorage.setItem(`doc_${currentUser}`, content);

    console.log("Document saved for", currentUser);
}


/* ---------- EXPORT (MOCK) ---------- */

function exportPDF() {
    if (!currentUser) {
        alert("Login required to export");
        return;
    }

    alert("PDF export is a placeholder in this prototype.");
}


/* ---------- AUTOSAVE (OPTIONAL) ---------- */

setInterval(() => {
    if (!currentUser) return;
    const editor = document.getElementById("editor");
    if (!editor) return;

    localStorage.setItem(`autosave_${currentUser}`, editor.innerHTML);
}, 30000);


/* ---------- RESTORE AUTOSAVE ---------- */

window.addEventListener("load", () => {
    if (!currentUser) return;

    const editor = document.getElementById("editor");
    const saved = localStorage.getItem(`autosave_${currentUser}`);

    if (editor && saved) {
        editor.innerHTML = saved;
    }
});
