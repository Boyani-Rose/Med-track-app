import React from 'react';
import MedCard from '../components/MedCard';
import { Link } from 'react-router-dom';
import './MyMedications.css';

function MyMedications({ medications, onUpdate, onComplete }) {
  return (
    <div className="my-medications">
      <h1>My Medications</h1>
      
      <Link to="/add-medication" className="add-med-btn">
        Add New Medication
      </Link>
      
      <div className="medications-grid">
        {medications.length === 0 ? (
          <div className="empty-state">
            <p>No medications added yet.</p>
            <Link to="/add-medication" className="add-med-btn">
              Add Your First Medication
            </Link>
          </div>
        ) : (
          medications.map(med => (
            <MedCard
              key={med.id}
              medication={med}
              onUpdate={onUpdate}
              onComplete={onComplete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MyMedications;