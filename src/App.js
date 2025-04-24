import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import MyMedications from "./pages/MyMedications";
import AddMedForm from "./components/AddMedForm";
import NavBar from "./components/NavBar";

function App() {
  const [medications, setMedications] = useState([]);
 


  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch("http://localhost:3001/medications");
        if (response.ok) {
          const data = await response.json();
          setMedications(data);
        }
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchMedications();
  }, []);

  const handleAddMedication = async (medication) => {
    try {
      const response = await fetch("http://localhost:3001/medications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...medication,

          startDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newMedication = await response.json();
        setMedications((prevMedications) => [
          ...prevMedications,
          newMedication,
        ]);
      }
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  const handleCompleteMedication = async (id) => {
    try {
      await fetch(`http://localhost:3001/medications/${id}`, {
        method: "DELETE",
      });

      setMedications(medications.filter((med) => med.id !== id));
    } catch (error) {
      console.error("Error completing medication:", error);
    }
  };

  useEffect(() => {
    if (!medications.length) return;

    const timeouts = [];
    let missedDoseInterval;

    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted");
          scheduleReminders();
          startMissedDoseCheck();
        }
      }
    };

    const scheduleReminders = () => {
      medications.forEach((med) => {
        const timesPerDay = calculateMedicationTimes(med.frequency);
        timesPerDay.forEach((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const timeout = scheduleDailyNotification(med, hours, minutes);
          timeouts.push(timeout);
        });
      });
    };

    const scheduleDailyNotification = (medication, hour, minute, slotIndex) => {
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
        // triggerNotification(medication);
        const today = new Date().toISOString().split("T")[0];
      const takenKey = `taken-${medication.id}-${today}-${slotIndex}`;

      if (!localStorage.getItem(takenKey)) {
        triggerNotification(medication);
      }
        
        scheduleDailyNotification(medication, hour, minute, slotIndex);
      }, timeUntilNotification);

      return timeoutId;
    };

    const triggerNotification = (medication) => {
      if (Notification.permission === "granted") {
        new Notification(`Time to take ${medication.name}`, {
          body: `Dosage: ${medication.dosage} pill(s)`,
        });
      }
    };

    const startMissedDoseCheck = () => {
      missedDoseInterval = setInterval(() => {
        const now = new Date();
  
        medications.forEach((med) => {
          const times = calculateMedicationTimes(med.frequency);
          times.forEach((time, index) => {
            const [hour, minute] = time.split(":").map(Number);
            const scheduledTime = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              hour,
              minute
            );
  
            const diffInMinutes = (now - scheduledTime) / (1000 * 60);
            const today = now.toISOString().split("T")[0];
            const takenKey = `taken-${med.id}-${today}-${index}`;
  
            if (diffInMinutes > 30 && !localStorage.getItem(takenKey)) {
              // Missed dose
              if (Notification.permission === "granted") {
                new Notification(`⏰ Missed dose for ${med.name}`, {
                  body: `You missed the dose scheduled at ${time}`,
                });
              }
              localStorage.setItem(takenKey, "missed");
            }
          });
        });
      }, 10 * 60 * 1000); // every 10 minutes
    };
  

    requestNotificationPermission();

   
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      clearInterval(missedDoseInterval)
    };
  }, [medications]);

 

  const calculateMedicationTimes = (frequency) => {
    const frequencyMap = {
      "Once a day": ["08:00"],
      "Twice a day": ["08:00", "20:00"],
      "Thrice a day": ["08:00", "14:00", "20:00"],
      "4 times a day": ["06:00", "12:00", "18:00", "22:00"],
    };
    return frequencyMap[frequency] || ["08:00"];
  };

  const handleUpdateMedication = (updatedMed) => {
    setMedications((prevMeds) =>
      prevMeds.map((med) =>
        med.id === updatedMed.id ? updatedMed : med
      )
    );
  };
  

  return (
    <Router>
      <NavBar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/add-medication"
            element={<AddMedForm onAdd={handleAddMedication} />}
          />
          <Route
            path="/my-medications"
            element={
              <MyMedications
                medications={medications}
                onComplete={handleCompleteMedication}
                onUpdate={handleUpdateMedication}
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
