// App.js
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import MyMedications from "./pages/MyMedications";
import AddMedForm from "./components/AddMedForm";
import NavBar from "./components/NavBar";

function App() {

  const [medications, setMedications] = useState([]);
  const [editingMed, setEditingMed] = useState(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  // const [midnightTrigger, setMidnightTrigger] = useState(0);

  


  
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

  
  const handleAddMedication = async (medication) => {
    try {
      const response = await fetch('http://localhost:3001/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...medication,
           
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
    if (!medications.length) return;
  
    const timeouts = [];
  
    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted');
          scheduleReminders();
        }
      }
    };
  
    const scheduleReminders = () => {
      medications.forEach(med => {
        const timesPerDay = calculateMedicationTimes(med.frequency);
        timesPerDay.forEach(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const timeout = scheduleDailyNotification(med, hours, minutes);
          timeouts.push(timeout);
        });
      });
    };
  
    const scheduleDailyNotification = (medication, hour, minute) => {
      const now = new Date();
      const notificationTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        0
      );
  
      if (notificationTime < now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }
  
      const timeUntilNotification = notificationTime - now;
  
      const timeoutId = setTimeout(() => {
        triggerNotification(medication);
        scheduleDailyNotification(medication, hour, minute); 
      }, timeUntilNotification);
  
      return timeoutId;
    };
  
    const triggerNotification = (medication) => {
      if (Notification.permission === 'granted') {
        new Notification(`Time to take ${medication.name}`, {
          body: `Dosage: ${medication.dosage} pill(s)`,
          // icon: '/medicine-icon.png',
          vibrate: [200, 100, 200],
        });
      }
    };
  
    requestNotificationPermission();
  
    // Clean up old timers
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [medications]);
  
  ;

  const calculateMedicationTimes = (frequency) => {
    // Match these exactly with your MedCard times (but in 24-hour format)
    const frequencyMap = {
      'Once a day': ['08:00'],        // 8:00 AM
      'Twice a day': ['08:00', '20:00'], // 8:00 AM, 8:00 PM
      'Thrice a day': ['08:00', '14:00', '20:00'], // 8:00 AM, 2:00 PM, 8:00 PM
      '4 times a day': ['06:00', '12:00', '18:00', '22:00'] // 6:00 AM, 12:00 PM, 6:00 PM, 10:00 PM
    };
    return frequencyMap[frequency] || ['08:00'];
  }

  // useEffect(() => {
  //   const now = new Date();
  //   const nextMidnight = new Date(
  //     now.getFullYear(),
  //     now.getMonth(),
  //     now.getDate() + 1,
  //     0, 0, 0
  //   );
  
  //   const msUntilMidnight = nextMidnight - now;
  
  //   const timeoutId = setTimeout(() => {
  //     setMidnightTrigger(prev => prev + 1); // Force re-render
  //   }, msUntilMidnight);
  
  //   return () => clearTimeout(timeoutId);
  // }, [midnightTrigger]);
  
  
  
  

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
