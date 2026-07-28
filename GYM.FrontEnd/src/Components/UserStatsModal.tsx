import React, { useState } from "react";
import { createStatistic } from "../api/stadistics";
import type { CreateStatisticBody } from "../types/StatsDTO";

interface UserStatsModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const initialForm = {
  weight: "",
  height: "",
  strength: "",
  mileRun: "",
  age: ""
};

export const UserStatsModal: React.FC<UserStatsModalProps> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const parseMileRunInput = (raw: string): string | null => {
    const trimmed = raw.trim();
    const threeParts = /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/.exec(trimmed);
    if (threeParts) {
      const [, hours, minutes, seconds] = threeParts;
      return `${hours.padStart(2, "0")}:
${minutes.padStart(2, "0")}:
${seconds.padStart(2, "0")}`.replace(/\n/g, "");
    }

    const twoParts = /^([0-9]{1,2}):([0-5][0-9])$/.exec(trimmed);
    if (twoParts) {
      const [, minutes, seconds] = twoParts;
      const totalMinutes = Number(minutes);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return `${String(hours).padStart(2, "0")}:
${String(mins).padStart(2, "0")}:
${seconds.padStart(2, "0")}`.replace(/\n/g, "");
    }

    return null;
  };

  const handleSave = async () => {
    setError(null);

    const weight = Number(form.weight);
    const height = Number(form.height);
    const strength = Number(form.strength);
    const age = Number(form.age);
    const mileRun = parseMileRunInput(form.mileRun);

    if (!form.weight || Number.isNaN(weight) || weight <= 0) {
      setError("Enter a valid weight.");
      return;
    }
    if (!form.height || Number.isNaN(height) || height <= 0) {
      setError("Enter a valid height.");
      return;
    }
    if (!form.strength || Number.isNaN(strength) || strength <= 0) {
      setError("Enter a valid strength.");
      return;
    }
    if (!form.age || Number.isNaN(age) || age <= 0) {
      setError("Enter a valid age.");
      return;
    }
    if (!mileRun) {
      setError("Mile run must be mm:ss or hh:mm:ss, e.g. 06:15 or 00:06:15.");
      return;
    }

    const body: CreateStatisticBody = {
      weight,
      height,
      strength,
      mileRun,
      age,
    };

    try {
      setSaving(true);
      await createStatistic(body);
      onCreated();
      onClose();
    } catch (err) {
      console.error("Error saving stat:", err);
      setError("Could not save the record. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="userstats-modal-screen" role="dialog" aria-modal="true" aria-labelledby="userstatsModalTitle">
      <div className="userstats-modal-backdrop" onClick={onClose} />
      <div className="userstats-modal-wrapper">
        <div className="userstats-modal-card">
          <div className="userstats-modal-header">
            <h5 className="userstats-modal-title" id="userstatsModalTitle">Create new record</h5>
            <button type="button" className="userstats-modal-close" aria-label="Close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="userstats-modal-body">
            {error && <p className="text-danger small">{error}</p>}

            <div className="userstats-modal-field">
              <label htmlFor="weight">Weight (kg)</label>
              <input id="weight" type="number" step="0.1" placeholder="75.5" value={form.weight} onChange={handleChange} />
            </div>
            <div className="userstats-modal-field">
              <label htmlFor="height">Height (cm)</label>
              <input id="height" type="number" placeholder="1.78" value={form.height} onChange={handleChange} />
            </div>
            <div className="userstats-modal-field">
              <label htmlFor="strength">Strength (lbs)</label>
              <input id="strength" type="number" placeholder="185" value={form.strength} onChange={handleChange} />
            </div>
            <div className="userstats-modal-field">
              <label htmlFor="age">Age</label>
              <input id="age" type="number" placeholder="25" value={form.age} onChange={handleChange} />
            </div>
            <div className="userstats-modal-field">
              <label htmlFor="mileRun">Mile run (mm:ss)</label>
              <input id="mileRun" type="text" placeholder="06:15" value={form.mileRun} onChange={handleChange} />
            </div>
          </div>
          <div className="userstats-modal-footer">
            <button type="button" className="btn btn-outline-secondary text-white" onClick={onClose} disabled={saving}>
              Close
            </button>
            <button type="button" className="btn btn-gq-purple" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save record"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
