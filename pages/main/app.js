// Modal functions
function openLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function openSignupModal() {
    document.getElementById('signup-modal').style.display = 'block';
}

function closeSignupModal() {
    document.getElementById('signup-modal').style.display = 'none';
}

// Event listeners
document.getElementById('login-btn').addEventListener('click', openLoginModal);
document.getElementById('signup-btn').addEventListener('click', openSignupModal);

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (login(username, password)) {
        alert('Login successful!');
    } else {
        alert('Invalid credentials!');
    }
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    if (signup(username, password)) {
        alert('Sign up successful!');
    } else {
        alert('Username already exists!');
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    if (event.target == loginModal) {
        closeLoginModal();
    }
    if (event.target == signupModal) {
        closeSignupModal();
    }
}

// Existing functions for the editor
function exportPDF() {
    // Placeholder
    alert('Export PDF functionality not implemented yet.');
}

function closeLatexModal() {
    document.getElementById('latex-modal').style.display = 'none';
}

function insertLatex() {
    // Placeholder
    closeLatexModal();
}

function loadSection(index) {
    // Placeholder
}

function formatDoc(command, value) {
    document.execCommand(command, false, value);
}

function openLatexModal() {
    document.getElementById('latex-modal').style.display = 'block';
}