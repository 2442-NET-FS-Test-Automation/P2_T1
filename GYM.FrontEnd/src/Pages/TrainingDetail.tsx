import { ExerciseCard } from "../Components/ExerciseCard";
import Navbar from "../Components/NavBar";
import "../css/Training.css";
export function TrainingDetail() {
  return (
    <>
      <Navbar onLogout={() => console.log("Cerrando sesión...")} />
      <section className="trainingDetail">
        <div className="text-center py-5 text-white">
          <h2 className="fw-bold" style={{ letterSpacing: "0.5px" }}>
            Exercises on this training
          </h2>
        </div>
        <div className="list-container">
          <section className="exercise-list">
            <ExerciseCard />
            <ExerciseCard />
            <ExerciseCard />
            <ExerciseCard />
          </section>
        </div>
      </section>
    </>
  );
}
