
import './LandingPage.css'; 
import placeholderGif from '../assets/take-your-meds.gif';
export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="#">
            <span className="brand-name">MedTrack</span>
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">Contact Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#get-started">About Us</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Side - Text Content */}
            <div className="col-lg-6">
              <h1 className="hero-title">Never Miss a Dose Again!</h1>
              <p className="hero-subtitle">
                Get reminders and progress tracking all in one app.
              </p>
              <button className="btn btn-primary btn-lg cta-button">
                Get Started
              </button>

              {/* Features List */}
              <div className="features mt-5">
                <h3 className="features-title">Key Features:</h3>
                <ul className="features-list">
                  <li>Smart medication reminders</li>
                  <li>Dose tracking (✅/⏰)</li>
                  <li>Weekly progress charts</li>
                  
                </ul>
              </div>
            </div>

            
            <div className="col-lg-6 d-none d-lg-block">
              <div className="gif-container">
                <img 
                  src={placeholderGif} 
                  alt="App demonstration" 
                  className="app-gif"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}