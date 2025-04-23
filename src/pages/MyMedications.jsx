import React, { useState } from 'react';
import MedCard from '../components/MedCard';
import { Link } from 'react-router-dom';
import './MyMedications.css';

function MyMedications({ medications, onUpdate, onComplete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-medications">
      <h1>My Medications</h1>

      <input
        type="text"
        placeholder="Search medications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <Link to="/add-medication" className="add-med-btn">
        Add New Medication
      </Link>

      <div className="medications-grid">
        {filteredMedications.length === 0 ? (
          <div className="empty-state">
            <p>No medications match your search.</p>
          </div>
        ) : (
          filteredMedications.map(med => (
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
