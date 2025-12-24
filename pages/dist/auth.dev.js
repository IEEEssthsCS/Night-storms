"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Common Auth system
var users = [];
var currentUser = null;

function loadUsers() {
  var response, data, localUsers;
  return regeneratorRuntime.async(function loadUsers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('../users.json'));

        case 3:
          response = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          data = _context.sent;
          users = data.users.map(function (u) {
            return _objectSpread({}, u, {
              fromJson: true
            });
          }); // Also load from localStorage for new users

          localUsers = JSON.parse(localStorage.getItem('users') || '[]');
          users = users.concat(localUsers);
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error loading users:', _context.t0);
          users = JSON.parse(localStorage.getItem('users') || '[]');

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}
/* =========================
   AUTH & USER SESSION LOGIC
   ========================= */


function checkLogin() {
  var user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    // User not logged in → redirect
    window.location.href = "../login/login.html";
    return;
  }

  var avatarURL = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=3b82f6&color=fff";
  /* ===== Sidebar ===== */

  var sidebarName = document.getElementById("sidebarUserName");
  var sidebarRole = document.getElementById("sidebarUserRole");
  var sidebarAvatar = document.getElementById("sidebarAvatar");
  if (sidebarName) sidebarName.textContent = user.name;
  if (sidebarRole) sidebarRole.textContent = user.role || "Standard Account";
  if (sidebarAvatar) sidebarAvatar.src = avatarURL;
  /* ===== Profile Header ===== */

  var profileName = document.getElementById("profileUserName");
  var profileAvatar = document.getElementById("profileAvatar");
  if (profileName) profileName.textContent = user.name;
  if (profileAvatar) profileAvatar.src = avatarURL;
}

function showLoggedIn() {
  if (!currentUser) return; // Update all username placeholders

  document.querySelectorAll(".user-info .name").forEach(function (el) {
    el.textContent = currentUser;
  }); // Update all avatars

  var avatarURL = "https://ui-avatars.com/api/?name=".concat(encodeURIComponent(currentUser), "&background=3b82f6&color=fff");
  document.querySelectorAll(".avatar-img, .user-card img").forEach(function (img) {
    img.src = avatarURL;
    img.alt = currentUser;
  }); // Hide login/signup buttons

  var loginBtn = document.getElementById("login-btn");
  var signupBtn = document.getElementById("signup-btn");
  var userProfile = document.getElementById("user-profile");
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
  var hashedPassword = hashPassword(password);
  var user = users.find(function (u) {
    return u.username === username && u.password === hashedPassword;
  });

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
  if (users.find(function (u) {
    return u.username === username;
  })) {
    return false; // user exists
  }

  var hashedPassword = hashPassword(password);
  var newUser = {
    username: username,
    password: hashedPassword
  };
  users.push(newUser);
  var localUsers = users.filter(function (u) {
    return !u.fromJson;
  });
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
} // Initialize


loadUsers().then(function () {
  checkLogin();
});