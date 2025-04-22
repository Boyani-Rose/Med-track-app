// App.js
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import MedCard from "./components/MedCard";
import AddMedForm from "./components/AddMedForm";
import NavBar from "./components/NavBar"; // We'll create this component next

function App() {

  const [medications, setMedications] = useState([]);
  const [editingMed, setEditingMed] = useState(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // Fetch medications from API
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch('http://localhost:3001/medications');
        if (response.ok) {
          const data = await response.json();
          setMedications(data);
        }
      } catch (error) {
        console.error('Error fetching medications:', error);
      }
    };

    fetchMedications();
  }, []);

  // Add new medication
  const handleAddMedication = async (medication) => {
    try {
      const response = await fetch('http://localhost:3001/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...medication,
          id: Date.now(), // Temporary ID until we get one from the server
          startDate: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const newMedication = await response.json();
        setMedications([...medications, newMedication]);
      }
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  // Update medication
  const handleUpdateMedication = async (updatedMed) => {
    try {
      const response = await fetch(`http://localhost:3001/medications/${updatedMed.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMed),
      });

      if (response.ok) {
        setMedications(medications.map(med => 
          med.id === updatedMed.id ? updatedMed : med
        ));
        setEditingMed(null);
      }
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  // Complete medication course
  const handleCompleteMedication = async (id) => {
    try {
      await fetch(`http://localhost:3001/medications/${id}`, {
        method: 'DELETE',
      });

      setMedications(medications.filter(med => med.id !== id));
      setShowCompletionMessage(true);
      setTimeout(() => setShowCompletionMessage(false), 3000);
    } catch (error) {
      console.error('Error completing medication:', error);
    }
  };

  // Set up reminders
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }

    const scheduleReminders = () => {
      medications.forEach(med => {
        const times = calculateMedicationTimes(med.frequency);
        
        times.forEach(time => {
          const [hours] = time.split(':');
          const now = new Date();
          const reminderTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours, 0, 0
          );
          
          if (reminderTime > now) {
            const timeout = reminderTime - now;
            
            setTimeout(() => {
              if (Notification.permission === 'granted') {
                new Notification(`Time to take ${med.name}`, {
                  body: `Dosage: ${med.dosage} pill(s)`,
                  icon: '/medicine-icon.png',
                  vibrate: [200, 100, 200],
                });
                
                // Play notification sound
                const audio = new Audio('/notification.mp3');
                audio.play();
              }
            }, timeout);
          }
        });
      });
    };

    scheduleReminders();
  }, [medications]);

  const calculateMedicationTimes = (frequency) => {
    const frequencyMap = {
      'Once a day': 1,
      'Twice a day': 2,
      'Thrice a day': 3,
      '4 times a day': 4
    };
    
    const totalDoses = frequencyMap[frequency] || 1;
    const interval = 24 / totalDoses;
    const times = [];
    
    for (let i = 0; i < totalDoses; i++) {
      const hour = Math.floor(i * interval);
      times.push(`${hour}:00`);
    }
    
    return times;
  }

  return (
    <Router>
      <NavBar />
      <div className="content-container">
        {showCompletionMessage && (
          <div className="completion-message">
            <p>Congratulations! You've completed your medication course! 🎉</p>
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/add-medication" 
            element={
              <AddMedForm 
                onAdd={handleAddMedication} 
                onUpdate={handleUpdateMedication}
                medicationToEdit={editingMed}
              />
            } 
          />
          <Route 
            path="/my-medications" 
            element={
              <MyMedications 
                medications={medications}
                onUpdate={setEditingMed}
                onComplete={handleCompleteMedication}
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
