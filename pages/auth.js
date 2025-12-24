// Common Auth system
let users = [];
let currentUser = null;

async function loadUsers() {
    try {
        const response = await fetch('../users.json');
        const data = await response.json();
        users = data.users.map(u => ({ ...u, fromJson: true }));
        // Also load from localStorage for new users
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.concat(localUsers);
    } catch (error) {
        console.error('Error loading users:', error);
        users = JSON.parse(localStorage.getItem('users') || '[]');
    }
}

function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

/* =========================
   AUTH & USER SESSION LOGIC
   ========================= */

function checkLogin() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        // User not logged in → redirect
        window.location.href = "../login/login.html";
        return;
    }

    const avatarURL =
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(user.name) +
        "&background=3b82f6&color=fff";

    /* ===== Sidebar ===== */
    const sidebarName = document.getElementById("sidebarUserName");
    const sidebarRole = document.getElementById("sidebarUserRole");
    const sidebarAvatar = document.getElementById("sidebarAvatar");

    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarRole) sidebarRole.textContent = user.role || "Standard Account";
    if (sidebarAvatar) sidebarAvatar.src = avatarURL;

    /* ===== Profile Header ===== */
    const profileName = document.getElementById("profileUserName");
    const profileAvatar = document.getElementById("profileAvatar");

    if (profileName) profileName.textContent = user.name;
    if (profileAvatar) profileAvatar.src = avatarURL;
}




function showLoggedIn() {
    if (!currentUser) return;

    // Update all username placeholders
    document.querySelectorAll(".user-info .name").forEach(el => {
        el.textContent = currentUser;
    });

    // Update all avatars
    const avatarURL =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser)}&background=3b82f6&color=fff`;

    document.querySelectorAll(".avatar-img, .user-card img").forEach(img => {
        img.src = avatarURL;
        img.alt = currentUser;
    });

    // Hide login/signup buttons
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const userProfile = document.getElementById("user-profile");

    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (userProfile) userProfile.style.display = "inline-flex";
}


function showLoginSignup() {
    // For index.html
    if (document.getElementById('login-btn')) {
        document.getElementById('login-btn').style.display = 'inline-block';
        document.getElementById('signup-btn').style.display = 'inline-block';
        document.getElementById('user-profile').style.display = 'none';
    }
}

function login(username, password) {
    const hashedPassword = hashPassword(password);
    const user = users.find(u => u.username === username && u.password === hashedPassword);
    if (user) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        showLoggedIn();
        if (document.getElementById('login-modal')) closeLoginModal();
        return true;
    }
    return false;
}

function signup(username, password) {
    if (users.find(u => u.username === username)) {
        return false; // user exists
    }
    const hashedPassword = hashPassword(password);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    const localUsers = users.filter(u => !u.fromJson);
    localStorage.setItem('users', JSON.stringify(localUsers));
    currentUser = username;
    localStorage.setItem('currentUser', username);
    showLoggedIn();
    if (document.getElementById('signup-modal')) closeSignupModal();
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.reload();
    localStorage.removeItem("currentUser");
    window.location.href = "../login/login.html";
}

// Initialize
loadUsers().then(() => {
    checkLogin();
});