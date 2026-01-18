import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-body">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="logo">
          <i className="fa-solid fa-graduation-cap"></i>{" "}
          Report<strong>Assist</strong>
        </div>

        <div className="nav-actions">
          <Link to="/signup" className="btn-text">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary">
            Register Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            A Digital Sanctuary for <br />
            <span>Academic Excellence</span>
          </h1>

          <div className="divider-line"></div>

          <p className="hero-tagline">
            Welcome to the Archive. A sophisticated environment designed for
            researchers, scholars, and students to draft reports with the
            precision of science and the soul of classical writing.
          </p>

          <div className="hero-btns">
            <Link to="/signup" className="btn-primary-large">
              Enter the Archive{" "}
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </Link>

            <a href="#about" onClick={scrollToFeatures} className="btn-outline-large">
              Discover the Methodology
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="about" className="features-grid">
        <div className="feature-card">
          <div className="icon-wrapper">
             <i className="fa-solid fa-scroll"></i>
          </div>
          <h3>Vintage Interface</h3>
          <p>
            Write on digital parchment designed to reduce fatigue and inspire
            creativity during long research sessions.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper">
            <i className="fa-solid fa-calculator"></i>
          </div>
          <h3>LaTeX Mastery</h3>
          <p>
            Seamlessly integrate complex equations using our built-in
            mathematical renderer without breaking flow.
          </p>
        </div>

        <div className="feature-card">
           <div className="icon-wrapper">
             <i className="fa-solid fa-book-atlas"></i>
           </div>
          <h3>Dossier Management</h3>
          <p>
            Organize your reports into structured archives with a professional
            academic outline and auto-formatting.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>
          © {new Date().getFullYear()} Digital Library of Research &
          Documentation. All rights reserved.
        </p>
      </footer>
    </div>
  );
}