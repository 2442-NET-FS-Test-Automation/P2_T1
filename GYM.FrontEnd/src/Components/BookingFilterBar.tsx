import "../css/Booking.css";
import { useState } from "react";

export interface FilterOptions {
  location: string;
  trainer: string;
  minExercises: string;
  difficulty: "all" | "Beginner" | "Intermediate" | "Advanced" | "Heroic";
}

interface BookingFilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export function BookingFilterBar({ onFilterChange }: BookingFilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    trainer: "",
    minExercises: "",
    difficulty: "all",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters as FilterOptions);
  };

  const handleClear = () => {
    const reset = {
      location: "",
      trainer: "",
      minExercises: "",
      difficulty: "all" as const,
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <section className="filter-bar">
      <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="form-label text-neon small fw-semibold mb-2 d-block">
            Trainer
          </label>
          <input
            type="text"
            name="trainer"
            value={filters.trainer}
            onChange={handleChange}
            className="filter-input"
            placeholder="Search trainer..."
          />
        </div>
        <div>
          <label className="form-label text-neon small fw-semibold mb-2 d-block">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="filter-input"
            placeholder="Search location..."
          />
        </div>

        <div>
          <label className="form-label text-neon small fw-semibold mb-2 d-block">
            Min Exercises
          </label>
          <input
            type="number"
            name="minExercises"
            min="0"
            value={filters.minExercises}
            onChange={handleChange}
            className="filter-input"
            placeholder="e.g. 5"
          />
        </div>

        {/* Updated select block with new labels */}
        <div>
          <label className="form-label text-neon small fw-semibold mb-2 d-block">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleChange}
            className="filter-input sort-dropdown"
            style={{ paddingRight: "2rem" }}
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner (1 Circle)</option>
            <option value="Intermediate">Intermediate (2 Circles)</option>
            <option value="Advanced">Advanced (3 Circles)</option>
            <option value="Heroic">Heroic (4 Circles)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="btn btn-neon w-100 py-2.5 rounded-pill fw-bold text-uppercase mt-2"
          style={{ backgroundColor: "#333652", color: "white" }}
        >
          Clear Filters
        </button>
      </form>
    </section>
  );
}
