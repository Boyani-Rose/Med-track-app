// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import MedList from './components/MedList';
import AddMedForm from './components/AddMedForm';
import NavBar from './components/NavBar'; // We'll create this component next

function App() {
  return (
    <Router>
      <NavBar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/add-medication" element={<AddMedForm />} />
          <Route path="/my-medications" element={<MedList />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;