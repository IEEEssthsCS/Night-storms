"use strict";

/*************************************************
 * APP.JS — Editor & Auth UI Logic
 * Frontend prototype (mock auth)
 *************************************************/

/* ---------- AUTH FORMS ---------- */
document.addEventListener("DOMContentLoaded", function () {
  /* LOGIN FORM */
  var loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var username = document.getElementById("login-username").value.trim();
      var password = document.getElementById("login-password").value;

      if (!login(username, password)) {
        alert("Invalid username or password");
      }
    });
  }
  /* SIGNUP FORM */


  var signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var username = document.getElementById("signup-username").value.trim();
      var password = document.getElementById("signup-password").value;

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


function formatDoc(command) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  document.execCommand(command, false, value);
}
/* ---------- SECTIONS (OUTLINE) ---------- */


function loadSection(index) {
  var editor = document.getElementById("editor");
  if (!editor) return;
  var sections = ["<h2>Abstract</h2><p>Write your abstract here...</p>", "<h2>Introduction</h2><p>Write your introduction here...</p>", "<h2>Literature Review</h2><p>Discuss related work here...</p>", "<h2>Methodology</h2><p>Describe your methodology here...</p>", "<h2>Conclusion</h2><p>Summarize your conclusions here...</p>"];
  editor.innerHTML = sections[index];
  document.querySelectorAll(".section-item").forEach(function (item, i) {
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

var latexInput = document.getElementById("latex-input");
var latexPreview = document.getElementById("latex-preview");

if (latexInput && latexPreview) {
  latexInput.addEventListener("input", function () {
    try {
      katex.render(latexInput.value, latexPreview, {
        throwOnError: false,
        trust: false,
        strict: "warn"
      });
    } catch (_unused) {
      latexPreview.textContent = "Invalid LaTeX";
    }
  });
}

function insertLatex() {
  var latex = latexInput.value.trim();
  if (!latex) return;
  var span = document.createElement("span");
  katex.render(latex, span, {
    throwOnError: false,
    trust: false
  });
  var editor = document.getElementById("editor");
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

  var content = document.getElementById("editor").innerHTML;
  localStorage.setItem("doc_".concat(currentUser), content);
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


setInterval(function () {
  if (!currentUser) return;
  var editor = document.getElementById("editor");
  if (!editor) return;
  localStorage.setItem("autosave_".concat(currentUser), editor.innerHTML);
}, 30000);
/* ---------- RESTORE AUTOSAVE ---------- */

window.addEventListener("load", function () {
  if (!currentUser) return;
  var editor = document.getElementById("editor");
  var saved = localStorage.getItem("autosave_".concat(currentUser));

  if (editor && saved) {
    editor.innerHTML = saved;
  }
});