import type { ExerciseDTO } from "../types/exerciseDTO";
import { ExerciseCard } from "./ExerciseCard";

interface ExerciseListProps {
  exercises: ExerciseDTO[];
  onExerciseClick: (exercise: ExerciseDTO) => void;
}

export function ExerciseList({
  exercises,
  onExerciseClick,
}: ExerciseListProps) {
  if (!exercises || exercises.length === 0) {
    return (
      <p className="text-neon small">No exercises listed for this training.</p>
    );
  }

  return (
    <div className="exercise-list">
      <h2>Exercises on this training</h2>
      <div className="exercise-list-items">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id ?? index}
            name={exercise.name}
            description={exercise.description}
            sets={exercise.sets}
            reps={exercise.reps}
            // Safely forwards the exercise payload context on every card interaction
            onClick={() => onExerciseClick(exercise)}
          />
        ))}
      </div>
    </div>
  );
}
