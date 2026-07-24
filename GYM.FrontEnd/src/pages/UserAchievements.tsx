import { useState, useEffect } from "react";
import { achievementsWithStatus, type Achievement } from "../services/achievementService";
import { getUser } from "../services/auth";
import type { UserData } from "../types/user";
import "../css/Achievements.css";

export default function Achievements() {
  const [user, setUser] = useState<UserData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate achievement progress
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;
  const progressPercentage =
    totalAchievements > 0
      ? Math.round((unlockedCount / totalAchievements) * 100)
      : 0;

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtenemos la información del usuario mediante el JWT
      const userData = await getUser();
      setUser(userData);

      // 2. Traemos los logros pasándole el ID del usuario (o null si no hay sesión)
      const data = await achievementsWithStatus(userData?.id ?? null);
      setAchievements(data);
    } catch (err: any) {
      setError(err?.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="achievements-page py-4">
        <div className="container" style={{ maxWidth: "800px" }}>

          {/* ENCABEZADO */}
          <header className="mb-4">
            <h2 className="fw-bold m-0" style={{ fontSize: "2rem" }}>
              Logros
            </h2>
            <p className="text-purple-light m-0 mt-1">Desbloquéalos todos</p>
          </header>

          {/* BANNER DE PROGRESO DE LOGROS */}
          <div className="done-achievements-banner d-flex align-items-center mb-4 shadow">
            <div className="me-3 fs-2">🏆</div>

            <div className="flex-grow-1 me-3">
              <div className="fw-bold text-white mb-2" style={{ fontSize: "1.1rem" }}>
                {unlockedCount} / {totalAchievements} logros desbloqueados
              </div>

              {/* Barra de Progreso con estilos nativos de Bootstrap estilizados */}
              <div className="progress custom-progress w-100">
                <div
                  className="progress-bar custom-progress-bar"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            <div className="fw-bold text-cyan fs-4 ms-auto">
              {progressPercentage}%
            </div>
          </div>

          {/* SECCIÓN PRINCIPAL */}
          <div>
            {/* Aviso en caso de no haber iniciado sesión */}
            {!user && !loading && (
              <div className="alert bg-dark text-warning border-warning mb-3" role="alert">
                🔑 Inicia sesión para guardar tu progreso y desbloquear logros.
              </div>
            )}

            {/* Mensaje de Error */}
            {error && (
              <div className="alert bg-dark text-danger border-danger mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Spinner de Carga */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-cyan" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-white-50">Cargando tus logros...</p>
              </div>
            ) : (
              /* Lista de Cards de Logros */
              <div className="d-flex flex-column gap-3">
                {achievements.map((item) => (
                  <div
                    key={item.id}
                    className={`achievement-card d-flex justify-content-between align-items-center ${item.unlocked ? "unlocked" : "locked"
                      }`}
                  >
                    <div>
                      <h5 className="fw-bold m-0 text-white">{item.title}</h5>
                      <p className="m-0 mt-1 text-white-50" style={{ fontSize: "0.9rem" }}>
                        {item.description}
                      </p>

                      <div className="mt-2" style={{ fontSize: "0.8rem" }}>
                        {item.unlocked ? (
                          <span className="text-purple-light">
                            Desbloqueado el{" "}
                            {item.completed_at
                              ? new Date(item.completed_at).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                              : ""}
                          </span>
                        ) : (
                          <span className="text-muted">Logro bloqueado</span>
                        )}
                      </div>
                    </div>

                    {/* Estado visual (check o candado) */}
                    <div className="ms-3 fs-4">
                      {item.unlocked ? "✅" : "🔒"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}