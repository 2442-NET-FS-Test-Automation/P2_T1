import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicTrainings } from "../services/TrainingService";
import type { TrainingDTO } from "../types/trainingDTO";
//import { useAuth } from '../auth/useAuth';
import "../css/LandingPage.css";
import { Carousel } from "../components/Carousel";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<TrainingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //const {status, logout} = useAuth();

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      
        //Load mockup data for users not authorized
        setWorkouts([
          {
            id: 1,
            trainingName: "Initial Strength",
            difficulty: "Beginner",
            place: "Gym",
            calories: 300,
            description:
              "Learn basic movement patterns and build a solid foundation.",
            estimatedTime: "00:45:00",
            exercises: [],
          },
          {
            id: 2,
            trainingName: "Urban Endurance",
            difficulty: "Intermediate",
            place: "Outdoor",
            calories: 450,
            description:
              "High-intensity circuit designed to burn calories outdoors.",
            estimatedTime: "01:00:00",
            exercises: [],
          },
          {
            id: 3,
            trainingName: "Titan's Power",
            difficulty: "Advanced",
            place: "Gym",
            calories: 600,
            description:
              "Focused on hypertrophy and heavy lifting for experienced athletes.",
            estimatedTime: "01:15:00",
            exercises: [],
          },
          {
            id: 4,
            trainingName: "Legendary Challenge",
            difficulty: "Heroic",
            place: "Home",
            calories: 750,
            description:
              "No-equipment calisthenics routine to test your mental and physical endurance.",
            estimatedTime: "01:30:00",
            exercises: [],
          },
        ]);
      setLoading(false);
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="landing-bg text-white min-vh-100 pb-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-3 container">
        <span className="navbar-brand fw-bold fs-3 cursor-pointer"></span>
        <div className="d-flex gap-2 ms-auto"></div>
      </nav>

      {/* Hero Banner Principal */}
      <header className="container my-3">
        <div className="hero-banner-box rounded-4 w-100 d-flex align-items-center justify-content-center text-center p-4">
          <div className="hero-overlay"></div>
          <div className="position-relative z-1">
            <span className="badge bg-dark text-neon mb-2 px-3 py-2 rounded-pill fs-6 border border-neon">
              ⚔️ Start your Fitness Quest!
            </span>
            <h2 className="display-5 fw-extrabold text-white m-0">
              Transform your Workout into a Quest
            </h2>
          </div>
        </div>
      </header>

      {/* Encabezado */}
      <section className="container text-center my-5">
        <h2 className="fw-semibold fs-3 mb-1 text-gold">Welcome to</h2>
        <h1 className="display-3 fw-bold mb-0">
          Gym<span className="text-neon text-capitalize">Quest</span> ⚔️
        </h1>
        <p className="text-white mt-2 fs-5">
          Choose your workout, earn XP, and level up every day.
        </p>
      </section>

      {/* Grid de Entrenamientos Mejorado */}
      <section className="container my-5 text-center">
        {loading ? (
          <div className="spinner-border text-neon" role="status">
            <span className="visually-hidden">Loading workouts...</span>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 text-start">
            {workouts.slice(0, 4).map((workout) => (
              <div key={workout.id ?? workout.trainingName} className="col">
                <div className="card quest-card h-100 rounded-4 overflow-hidden position-relative">
                  {/* Encabezado de la Tarjeta (Imagen / Badge de Estadísticas) */}
                  <div className="quest-card-header p-3 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge badge-difficulty rounded-pill px-2 py-1">
                        {workout.difficulty}
                      </span>
                      <span className="badge badge-place rounded-pill px-2 py-1">
                        📍 {workout.place}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-end mt-4">
                      <span className="stat-chip">
                        🔥 {workout.calories} kcal
                      </span>
                      <span className="stat-chip">
                        ⏱️ {workout.estimatedTime.substring(0, 5)} hrs
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="card-body p-3 d-flex flex-column justify-content-between">
                    <div>
                      <h3 className="fs-5 text-white fw-bold mb-2">
                        {workout.trainingName}
                      </h3>
                      <p className="quest-description small mb-0">
                        {workout.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-top border-secondary-subtle d-flex align-items-center justify-content-between">
                      {/* <span className="text-neon small fw-semibold">
                        View Quest
                      </span>
                      <span className="text-neon">➔</span> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón Acción Principal */}
        <div className="mt-5">
          <button
            className="btn btn-neon rounded-pill px-5 py-3 fw-bold text-uppercase fs-6 shadow-neon"
            onClick={() => navigate("/login")}
          >
            More Trainings ⚔️
          </button>
        </div>
      </section>
      <Carousel/>

      {/* Sección de Logros y Funcionalidades */}
      <section className="container my-5 pt-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 text-center h-100">
              <div className="feature-icon-wrapper mb-3">🏆</div>
              <h3 className="fs-5 text-neon fw-bold mb-2">Unlock Achievements</h3>
              <p className="text-gold small m-0">
                Earn experience and level up by completing your daily
                routines.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 text-center h-100">
              <div className="feature-icon-wrapper mb-3">📊</div>
              <h3 className="fs-5 text-neon fw-bold mb-2">Track your Progress</h3>
              <p className="text-gold small m-0">
                Visualize your strength and consistency statistics week by
                week.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 text-center h-100">
              <div className="feature-icon-wrapper mb-3">📜</div>
              <h3 className="fs-5 text-neon fw-bold mb-2">Daily Quests</h3>
              <p className="text-gold small m-0">
                Overcome personalized challenges created by your coach.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
