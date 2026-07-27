import { GiWeightLiftingUp } from "react-icons/gi";
import "../css/ExerciseCard.css";

interface ExerciseCardProps {
  name?: string;
  description?: string;
  sets?: number;
  reps?: number;
}

export function ExerciseCard({
  name = "Exercise Name",
  description = "Exercise description",
  sets,
  reps,
}: ExerciseCardProps) {
  return (
    <section className="exercise-card">
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
            <p>{sets} sets × {reps} reps</p>
          )}
        </div>
      </div>
    </section>
  );
}