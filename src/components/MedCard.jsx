import { useState, useEffect } from "react";
import "./MedCard.css";

function MedCard({ medication, onUpdate, onComplete }) {
  const [takenToday, setTakenToday] = useState(0);
  const [status, setStatus] = useState("pending");
  const totalDosesPerDay = getDosesPerDay(medication.frequency);

  function getDosesPerDay(frequency) {
    const frequencyMap = {
      "Once a day": 1,
      "Twice a day": 2,
      "Thrice a day": 3,
      "4 times a day": 4,
    };
    return frequencyMap[frequency] || 1;
  }

  const currentTotalTaken = medication.totalTaken || 0;
  const courseProgress = Math.round(
    (currentTotalTaken / medication.total) * 100
  );

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(`takenToday-${medication.id}-${today}`);
    if (saved) {
      setTakenToday(parseInt(saved));
    }
  }, [medication.id]);

  const handleTakeDose = async () => {
    if (takenToday >= totalDosesPerDay) return;

    if (!isWithinAllowedTime()) {
      alert("⏰ You can only mark this dose within 30 minutes of the scheduled time.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/medications/${medication.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalTaken: (medication.totalTaken || 0) + medication.dosage,
            
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedMed = await response.json();
      const newTakenToday = takenToday + 1;
      setTakenToday(newTakenToday);

      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(
        `takenToday-${medication.id}-${today}`,
        newTakenToday.toString()
      );

      onUpdate(updatedMed);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const isWithinAllowedTime = () => {
    const now = new Date();
    return medicationTimes.some((scheduledTime, index) => {
      if (index < takenToday) return false; // already taken this slot
  
      const diffInMinutes = Math.abs((now - scheduledTime) / (1000 * 60));
      return diffInMinutes <= 30; // allow marking if within 30 mins
    });
  };
  

  const handleComplete = async () => {
    if (courseProgress < 100) {
      const proceed = window.confirm(
        "You have not finished all doses. Are you sure you want to complete this course?"
      );
      if (!proceed) return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/medications/${medication.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed! Status: ${response.status}`);
      }

      onComplete(medication.id);
    } catch (err) {
      console.error("Failed to complete medication:", err);
    }
    alert("🎉 Congratulations! You've completed your medication course!");
  };

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );

    const timeUntilMidnight = midnight - now;

    const resetTimer = setTimeout(() => {
      setTakenToday(0);
      setStatus("pending");
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(`takenToday-${medication.id}-${today}`, "0");
    }, timeUntilMidnight);

    return () => clearTimeout(resetTimer);
  }, [medication.id]);

  // const getMedicationTimes = () => {
  //   const timeMap = {
  //     "Once a day": ["8:00 AM"],
  //     "Twice a day": ["8:00 AM", "8:00 PM"],
  //     "Thrice a day": ["8:00 AM", "2:00 PM", "8:00 PM"],
  //     "4 times a day": ["6:00 AM", "12:00 PM", "6:00 PM", "10:00 PM"],
  //   };

  //   return timeMap[medication.frequency] || ["8:00 AM"];
  // };
  const getMedicationTimes = () => {
    const timeMap = {
      "Once a day": ["08:00"],
      "Twice a day": ["08:00", "20:00"],
      "Thrice a day": ["08:00", "14:00", "20:00"],
      "4 times a day": ["06:00", "12:00", "18:00", "22:00"],
    };
  
    const times = timeMap[medication.frequency] || ["08:00"];
  
    return times.map((timeStr) => {
      const [hour, minute] = timeStr.split(":").map(Number);
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    });
  };
  

  const medicationTimes = getMedicationTimes();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this medication?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3001/medications/${medication.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed! Status: ${response.status}`);
      }

      onComplete(medication.id); // same as your complete button
    } catch (err) {
      console.error("Failed to delete medication:", err);
    }
  };

  return (
    <div className={`med-card ${status}`}>
      <div className="card-header">
        <h3>{medication.name}</h3>
        <button
          className="delete-btn"
          onClick={handleDelete}
          title="Remove medication"
        >
          x
        </button>

        <p>Dosage: {medication.dosage} pill(s) per dose</p>
      </div>

      <div className="card-schedule">
        <p>Times to take:</p>
        <div className="time-slots">
          {medicationTimes.map((time, index) => (
            <span
              key={index}
              className={index < takenToday ? "taken" : "pending"}
            >
              {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
          {takenToday >= totalDosesPerDay ? "Done for today" : "Mark as Taken"}
        </button>

        <button className="complete-btn" onClick={handleComplete}>
          Complete Course
        </button>
      </div>
    </div>
  );
}

export default MedCard;
