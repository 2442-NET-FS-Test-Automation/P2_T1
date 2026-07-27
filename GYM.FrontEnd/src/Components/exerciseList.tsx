import type { exerciseDTO } from "../types/exerciseDTO";
import { ExerciseCard } from "./ExerciseCard";

interface ExerciseListProps {
  exercises: exerciseDTO[];
}

export function ExerciseList({ exercises }: ExerciseListProps) {
  if (!exercises || exercises.length === 0) {
    return <p className="text-neon small">No exercises listed for this training.</p>;
  }

  return (
    <div className="exercise-list">
      <h2>Exercises on this training</h2>
      <div className="exercise-list-items">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            name={exercise.name}
            description={exercise.description}
            sets={exercise.sets}
            reps={exercise.reps}
          />
        ))}
      </div>
    </div>
  );
}