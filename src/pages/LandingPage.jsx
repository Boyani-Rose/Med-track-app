import './LandingPage.css'; 
import placeholderGif from '../assets/take-your-meds.gif';
import { useNavigate } from 'react-router-dom'


export default function LandingPage() {
  const navigate = useNavigate(); 

  const handleGetStarted = () => {
    navigate('/add-medication'); 
  }
  return (
    <div className="landing-page">
     

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
              <button 
                className="btn btn-primary btn-lg cta-button"
                onClick={handleGetStarted} // Add onClick handler
              >
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