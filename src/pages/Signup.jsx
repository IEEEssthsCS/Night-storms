import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signup.css";


export default function Signup() {
  const navigate = useNavigate();
  
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
    setError(""); // Clear errors when user types
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API Call delay
    setTimeout(() => {
      // Basic validation logic (Mock)
      if (formData.email.includes("error")) {
        setError("Invalid email or password provided.");
        setIsLoading(false);
      } else {
        console.log(`${mode.toUpperCase()} Success:`, formData);
        navigate("/dashboard");
      }
    }, 1500);
  };

  // Toggle Mode (Clear state)
  const toggleMode = (newMode) => {
    setMode(newMode);
    setError("");
    setFormData({ ...formData, firstName: "", lastName: "" }); // Reset names, keep email/pass if desired
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