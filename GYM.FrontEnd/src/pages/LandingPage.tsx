import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicTrainings } from '../services/TrainingService';
import type { TrainingDTO } from '../types/trainingDTO';
//import { useAuth } from '../auth/useAuth';
import '../css/LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<TrainingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //const {status, logout} = useAuth();

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      const data = await getPublicTrainings();
      
      if (!data || data.length === 0) {
        setWorkouts([
          {
            id: 1,
            trainingName: 'Fuerza Inicial',
            difficulty: 'Beginner',
            place: 'Gym',
            calories: 300,
            description: 'Aprende los patrones de movimiento básicos y construye una base sólida.',
            estimatedTime: '00:45:00',
            exercises: []
          },
          {
            id: 2,
            trainingName: 'Resistencia Urbana',
            difficulty: 'Intermediate',
            place: 'Outdoor',
            calories: 450,
            description: 'Circuito de alta intensidad diseñado para quemar calorías al aire libre.',
            estimatedTime: '01:00:00',
            exercises: []
          },
          {
            id: 3,
            trainingName: 'Poder de Titán',
            difficulty: 'Advanced',
            place: 'Gym',
            calories: 600,
            description: 'Enfocado en hipertrofia y levantamientos pesados para atletas con experiencia.',
            estimatedTime: '01:15:00',
            exercises: []
          },
          {
            id: 4,
            trainingName: 'Desafío Legendario',
            difficulty: 'Heroic',
            place: 'Home',
            calories: 750,
            description: 'Rutina calisténica sin equipo para probar tu resistencia mental y física.',
            estimatedTime: '01:30:00',
            exercises: []
          }
        ]);
      } else {
        setWorkouts(data);
      }
      setLoading(false);
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="landing-bg text-white min-vh-100 pb-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-3 container">
          <span className="navbar-brand fw-bold fs-3 cursor-pointer" ></span>
          <div className="d-flex gap-2 ms-auto">        
          </div>
      </nav>

      {/* Hero Banner Principal */}
      <header className="container my-3">
        <div className="hero-banner-box rounded-4 w-100 d-flex align-items-center justify-content-center text-center p-4">
          <div className="hero-overlay"></div>
          <div className="position-relative z-1">
            <span className="badge bg-dark text-neon mb-2 px-3 py-2 rounded-pill fs-6 border border-neon">
              ⚔️ ¡Comienza tu Aventura Fitness!
            </span>
            <h2 className="display-5 fw-extrabold text-white m-0">
              Transforma tu Entrenamiento en una Quest
            </h2>
          </div>
        </div>
      </header>

      {/* Encabezado */}
      <section className="container text-center my-5">
        <h2 className="fw-semibold fs-3 mb-1 text-gold">
          Welcome to
        </h2>
        <h1 className="display-3 fw-bold mb-0">
          Gym<span className="text-neon">Quest</span> ⚔️
        </h1>
        <p className="text-white mt-2 fs-5">
          Elige tu entrenamiento, gana XP y sube de nivel cada día.
        </p>
      </section>

      {/* Grid de Entrenamientos Mejorado */}
      <section className="container my-5 text-center">
        {loading ? (
          <div className="spinner-border text-neon" role="status">
            <span className="visually-hidden">Cargando entrenamientos...</span>
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
                      <span className="text-neon small fw-semibold">Ver Quest</span>
                      <span className="text-neon">➔</span>
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
            onClick={() => navigate('/login')}
          >
            More Trainings ⚔️
          </button>
        </div>
      </section>

      {/* Sección de Logros y Funcionalidades */}
      <section className="container my-5 pt-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 text-center h-100">
              <div className="feature-icon-wrapper mb-3">🏆</div>
              <h3 className="fs-5 text-neon fw-bold mb-2">Desbloquea Logros</h3>
              <p className="text-gold small m-0">Gana experiencia y sube de nivel completando tus rutinas diarias.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 text-center h-100">
              <div className="feature-icon-wrapper mb-3">📊</div>
              <h3 className="fs-5 text-neon fw-bold mb-2">Sigue tu Progreso</h3>
              <p className="text-gold small m-0">Visualiza tus estadísticas de fuerza y consistencia semana a semana.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 text-center h-100">
              <div className="feature-icon-wrapper mb-3">📜</div>
              <h3 className="fs-5 text-neon fw-bold mb-2">Misiones Diarias</h3>
              <p className="text-gold small m-0">Supera desafíos personalizados creados por tu entrenador.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};