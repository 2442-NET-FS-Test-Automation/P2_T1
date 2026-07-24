import { ExerciseCard } from "../components/ExerciseCard";
import Navbar from "../components/Navbar"
import "../css/Training.css";
export function Trainings() {
  return (
    <>
      <Navbar onLogout={() => console.log("Cerrando sesión...")} />
      <section className="trainingsContainer">
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
