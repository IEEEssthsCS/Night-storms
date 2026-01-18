// 1. We remove 'BrowserRouter' from here because it is already in main.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Layout from "./components/Layout";

// Pages
// NOTE: Make sure your actual file names in the folder start with a Capital Letter!
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Editor from "./pages/Editor"; 
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates"; // Capital T
import Settings from "./pages/Settings";   // Capital S
import Profile from "./pages/Profile";     // Capital P

export default function App() {
  return (
    // 2. We only use <Routes> here. The router is handled by the parent (main.jsx)
    <Routes>
      {/* PUBLIC ROUTES (No Sidebar) */}
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* EDITOR (Standalone Full Screen) */}
      <Route path="/main" element={<Editor />} />

      {/* PROTECTED APP ROUTES (Wrapped in Sidebar Layout) */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback for 404: Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}