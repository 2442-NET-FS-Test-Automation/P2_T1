import { GiWeightLiftingUp } from "react-icons/gi";
import "../css/ExerciseCard.css";

interface ExerciseCardProps {
  name?: string;
  description?: string;
  sets?: number;
  reps?: number;
  onClick?: () => void; // Added click action contract
}

export function ExerciseCard({
  name = "Exercise Name",
  description = "Exercise description",
  sets,
  reps,
  onClick, // Destructured property hook
}: ExerciseCardProps) {
  return (
    <section
      className="exercise-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }} // Indicates interactivity visually
    >
      <div className="exercise-card-icon">
        <GiWeightLiftingUp size={28} />
      </div>
      <div className="exercise-card-details">
        <div className="detail-a">
          <h3>{name}</h3>
          <h4>{description}</h4>
        </div>
        <div className="detail-b">
          {sets && reps && (
            <p>
              {sets} sets × {reps} reps
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
