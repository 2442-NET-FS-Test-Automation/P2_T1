import { useLocation, useNavigate } from "react-router-dom";
import { ExerciseCard } from "../components/ExerciseCard";
import type { TrainingDTO } from "../types/trainingDTO";
import "../css/Training.css";

export function TrainingDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Recover the dynamic training details forwarded from the BookingCard link click
  const routeState = location.state as { training?: TrainingDTO } | null;
  const training = routeState?.training;

  if (!training) {
    return (
      <section className="trainingDetail">
        <div className="text-center py-5 text-white">
          <h2 className="fw-bold">No Training Context Loaded</h2>
          <button 
            className="btn btn-outline-info mt-3"
            onClick={() => navigate("/user/mybookings")}
            style={{ borderRadius: "20px", padding: "0.5rem 1.5rem" }}
          >
            ← Return to Bookings
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="trainingDetail">
        
        {/* Responsive Header Node displaying the dynamic routine info */}
        <div className="text-center py-5 text-white">
          <button 
            className="btn btn-sm btn-dark text-muted mb-3" 
            onClick={() => navigate("/user/mybookings")}
            style={{ border: "1px solid #232545", borderRadius: "15px" }}
          >
            ← Back to My Bookings
          </button>
          
          <h2 className="fw-bold" style={{ letterSpacing: "0.5px" }}>
            {training.trainingName}
          </h2>
          
          <p className="text-muted small mt-2 mb-0">
            Intensity: <span style={{ color: "#46f0d2" }}>{training.difficulty}</span> | 
            Burn Target: <span style={{ color: "#46f0d2" }}>~{training.calories} kcal</span>
          </p>
        </div>

        {/* Exercises Container Segment matching your layout list structure */}
        <div className="list-container">
          <section className="exercise-list">
            {training.exercises && training.exercises.length > 0 ? (
              training.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id ?? index}
                  name={exercise.name}
                  description={exercise.description}
                  sets={exercise.sets}
                  reps={exercise.reps}
                  // Links each individual movement card down into the ExerciseDetail node
                  onClick={() => {
                    const targetId = exercise.id ?? index;
                    navigate(`/exercise/${targetId}`, { state: { exercise } });
                  }}
                />
              ))
            ) : (
              <p className="text-center text-white-50 w-100 py-4">
                No exercise definitions are currently attached to this workout blueprint.
              </p>
            )}
          </section>
        </div>

      </section>
    </>
  );
}
