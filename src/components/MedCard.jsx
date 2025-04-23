import { useState, useEffect } from 'react';
import './MedCard.css';

function MedCard({ medication, onUpdate, onComplete }) {
  const [takenToday, setTakenToday] = useState(0);
  const [status, setStatus] = useState('pending');
  const totalDosesPerDay = getDosesPerDay(medication.frequency);

  function getDosesPerDay(frequency) {
    const frequencyMap = {
      'Once a day': 1,
      'Twice a day': 2,
      'Thrice a day': 3,
      '4 times a day': 4
    };
    return frequencyMap[frequency] || 1;
  }

  const currentTotalTaken = (medication.totalTaken || 0) + takenToday;
const courseProgress = Math.round(
  (currentTotalTaken / medication.total) * 100
);

useEffect(() => {
  const today = new Date().toISOString().split('T')[0]; // e.g. '2025-04-22'
  const saved = localStorage.getItem(`takenToday-${medication.id}-${today}`);
  if (saved) {
    setTakenToday(parseInt(saved));
  }
}, [medication.id]);


  // Either remove handleTakeDose or implement it with a button in the UI
  const handleTakeDose = async () => {
    if (takenToday >= totalDosesPerDay) return;
  
    try {
      const response = await fetch(`http://localhost:3001/medications/${medication.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalTaken: (medication.totalTaken || 0) + 1
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const updatedMed = await response.json();
      const newTakenToday = takenToday + 1;
      setTakenToday(newTakenToday);
  
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`takenToday-${medication.id}-${today}`, newTakenToday.toString());
  
      onUpdate(updatedMed); 
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  
  const handleComplete = () => {
    onComplete(medication.id);
  };

  // Reset taken doses at midnight
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );
    
    const timeUntilMidnight = midnight - now;

    const resetTimer = setTimeout(() => {
      setTakenToday(0);
      setStatus('pending');
      const today = new Date().toISOString().split('T')[0];
localStorage.setItem(`takenToday-${medication.id}-${today}`, '0');

    }, timeUntilMidnight);

    return () => clearTimeout(resetTimer);
  }, [medication.id]);

 
  const getMedicationTimes = () => {
    
    const timeMap = {
      'Once a day': ['8:00 AM'],
      'Twice a day': ['8:00 AM', '8:00 PM'],
      'Thrice a day': ['8:00 AM', '2:00 PM', '8:00 PM'],
      '4 times a day': ['6:00 AM', '12:00 PM', '6:00 PM', '10:00 PM']
    };

   
    return timeMap[medication.frequency] || ['8:00 AM'];
  };
  const medicationTimes = getMedicationTimes();

  return (
    <div className={`med-card ${status}`}>
      <div className="card-header">
        <h3>{medication.name}</h3>
        <p>Dosage: {medication.dosage} pill(s) per dose</p>
      </div>
      
      <div className="card-schedule">
        <p>Times to take:</p>
        <div className="time-slots">
          {medicationTimes.map((time, index) => (
            <span 
              key={index} 
              className={index < takenToday ? 'taken' : 'pending'}
            >
              {time}
            </span>
          ))}
        </div>
      </div>
      
      <div className="card-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${courseProgress}%` }}
          ></div>
        </div>
        <span>{courseProgress}% completed</span>
      </div>
      
      <div className="card-actions">
      <button 
          className="take-btn"
          onClick={handleTakeDose}
          disabled={takenToday >= totalDosesPerDay || courseProgress >= 100}
        >
          {takenToday >= totalDosesPerDay ? 'Done for today' : 'Mark as Taken'}
        </button>
        
        <button 
          className="complete-btn"
          onClick={handleComplete}
        >
          Complete Course
        </button>
      </div>
    </div>
  );
}

export default MedCard;