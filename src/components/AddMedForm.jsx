import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MedForm.css";

function MedicationForm({ onAdd }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Once a day",
    total: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const medicationData = {
      ...formData,
      totalTaken: 0,
    };

    onAdd(medicationData);
    navigate("/my-medications");
  };

  return (
    <form onSubmit={handleSubmit} className="medication-form">
      <h2>Add New Medication</h2>

      <div className="form-group">
        <label>Drug Name and dosage</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Ibuprofen 200mg"
          required
        />
      </div>

      <div className="form-group">
        <label>No. of pills per dose</label>
        <input
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          placeholder="e.g. 3"
          required
        />
      </div>

      <div className="form-group">
        <label>Frequency</label>
        <select
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
        >
          <option>Once a day</option>
          <option>Twice a day</option>
          <option>Thrice a day</option>
          <option>4 times a day</option>
        </select>
      </div>

      <div className="form-group">
        <label>Total Medications</label>
        <input
          type="number"
          name="total"
          min="1"
          value={formData.total}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-btn">
        Add Medication
      </button>
    </form>
  );
}

export default MedicationForm;
