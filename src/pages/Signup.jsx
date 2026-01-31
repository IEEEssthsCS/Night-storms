import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signup.css";

export default function Signup() {
  const navigate = useNavigate();
  
  // Configuration: Change this to your actual backend URL
  const API_URL = "http://localhost:5000/api/auth";

  // State
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form Data State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Determine the endpoint based on mode
      const endpoint = mode === "login" ? `${API_URL}/login` : `${API_URL}/signup`;

      // 2. Filter data: Don't send names if logging in
      const payload = mode === "login" 
        ? { email: formData.email, password: formData.password }
        : formData;

      // 3. Make the Request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // 4. Handle Errors from Backend
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // 5. Success Logic
      console.log(`${mode.toUpperCase()} Success:`, data);
      
      // ✅ FIX: Save Token AND User Data
      if (data.token) {
        localStorage.setItem("token", data.token);
        
        // I REMOVED THE COMMENT '//' BELOW SO IT NOW SAVES THE DATA:
        localStorage.setItem("user", JSON.stringify(data.user)); 
      }

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Mode (Clear state)
  const toggleMode = (newMode) => {
    setMode(newMode);
    setError("");
    // Reset names, keep email/pass for convenience
    setFormData(prev => ({ ...prev, firstName: "", lastName: "" })); 
  };

  return (
    <div className="auth-page"> 
      {/* WRAPPER DIV mainly for CSS background styling */}
      
      <nav className="auth-nav">
        <div className="logo">
          <i className="fa-solid fa-graduation-cap" /> Report<strong>Assist</strong>
        </div>
        <div className="nav-actions">
          <Link to="/" className="btn-text">
            <i className="fa-solid fa-arrow-left" /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="auth-container">
        <div className={`auth-card-wrapper ${mode}`}>
          
          <div className="auth-branding">
            <div className="auth-icon">
              <i className={`fa-solid ${mode === 'login' ? 'fa-book-open' : 'fa-scroll'}`} />
            </div>
            <h1 className="auth-title">
              {mode === 'login' ? "Welcome Back" : "Join the Community"}
            </h1>
            <p className="auth-subtitle">
              {mode === 'login' ? "Secure Access for Scholars" : "Create Your Scholarly Account"}
            </p>
          </div>

          {/* Show Error if exists */}
          {error && <div className="auth-error"><i className="fa-solid fa-circle-exclamation"/> {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            
            {/* SIGNUP SPECIFIC FIELDS */}
            {mode === "signup" && (
              <div className="input-row">
                <div className="input-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            )}

            {/* COMMON FIELDS */}
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button className="btn-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span><i className="fa-solid fa-circle-notch fa-spin" /> Processing...</span>
              ) : (
                mode === 'login' ? "Access Dashboard" : "Create Account"
              )}
            </button>
          </form>

          <div className="card-footer">
            {mode === 'login' ? "New to ReportAssist? " : "Already a member? "}
            <span 
              className="switch-link" 
              onClick={() => toggleMode(mode === 'login' ? 'signup' : 'login')}
              role="button"
              tabIndex={0}
            >
              {mode === 'login' ? "Register Here" : "Sign In"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}