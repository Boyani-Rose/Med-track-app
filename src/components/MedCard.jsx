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

  const progress = Math.round((takenToday / totalDosesPerDay) * 100);

  const handleTakeDose = () => {
    if (takenToday < totalDosesPerDay) {
      setTakenToday(takenToday + 1);
      setStatus('taken');
      // In a real app, you would update this in the backend
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
    }, timeUntilMidnight);

    return () => clearTimeout(resetTimer);
  }, []);

  // Calculate medication times
  const getMedicationTimes = () => {
    const times = [];
    const totalDoses = getDosesPerDay(medication.frequency);
    const interval = 24 / totalDoses;

    for (let i = 0; i < totalDoses; i++) {
      const hour = Math.floor(i * interval);
      times.push(`${hour}:00`);
    }

    return times;
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
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span>{progress}% completed today</span>
      </div>
      
      <div className="card-actions">
        <button 
          className="edit-btn"
          onClick={() => onUpdate(medication.id)}
        >
          Edit
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