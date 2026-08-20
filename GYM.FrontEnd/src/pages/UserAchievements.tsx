import { useState, useEffect } from "react";
import { getUser } from "../services/auth";
import type { UserData } from "../types/user";
import {
  getAchievements,
  getUserAchievement,
} from "../services/achievementService";
import "../css/Achievements.css";
import type { AchievementDTO } from "../types/AchievementDTO";

// Tipo local con las propiedades calculadas para el render
// FIXED: Synchronized property token to match standard camelCase definitions ('completedAt')
interface AchievementDisplay extends AchievementDTO {
  unlocked: boolean;
  completedAt?: string | null;
}

export default function Achievements() {
  const [user, setUser] = useState<UserData | null>(null);
  const [achievements, setAchievements] = useState<AchievementDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cálculo de progreso
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
      // 1. Obtener el usuario autenticado
      const userData = await getUser();
      setUser(userData);

      // 2. Traer el catálogo completo de logros
      // FIXED: Dropped parameters string argument to match your cleaned service method signatures arity
      const catalog = await getAchievements();

      // 3. Traer los logros completados del usuario (si hay usuario)
      let userAchievementsList: any[] = [];
      if (userData?.id) {
        try {
          userAchievementsList = await getUserAchievement();
        } catch (err) {
          // Si el backend regresa 404 por no tener logros aún, lo manejamos como lista vacía
          userAchievementsList = [];
        }
      }

      // 4. Cruzar el catálogo con los logros del usuario
      const merged: AchievementDisplay[] = catalog.map((item: any) => {
        const found = userAchievementsList.find(
          (ua: any) => ua.achievementId === item.id || ua.id === item.id,
        );

        // Aseguramos todas las propiedades requeridas por AchievementDisplay
        return {
          id: item.id,
          name: item.name ?? item.title ?? "",
          description: item.description ?? "",
          icon: item.icon ?? "",
          points: item.points ?? 0,
          conditionType: item.conditionType ?? item.condition_type ?? "",
          conditionValue: item.conditionValue ?? item.condition_value ?? 0,
          unlocked: !!found,
          // FIXED: Standardized fallback reading assignment properties logic
          completedAt: found
            ? found.completedAt || found.completed_At || null
            : null,
        } as AchievementDisplay;
      });

      setAchievements(merged);
    } catch (err: any) {
      setError(err?.message || "Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="achievements-page py-4">
        <div className="container" style={{ maxWidth: "800px" }}>
          {/* HEADER */}
          <header className="mb-4">
            <h2 className="fw-bold m-0" style={{ fontSize: "2rem" }}>
              Achievements
            </h2>
            <p className="text-purple-light m-0 mt-1">Unlock them all</p>
          </header>

          {/* ACHIEVEMENT PROGRESS BAR */}
          <div className="done-achievements-banner d-flex align-items-center mb-4 shadow">
            <div className="me-3 fs-2">🏆</div>

            <div className="flex-grow-1 me-3">
              <div
                className="fw-bold text-white mb-2"
                style={{ fontSize: "1.1rem" }}
              >
                {unlockedCount} / {totalAchievements} Unlocked achievements
              </div>

              {/* Barra de Progreso */}
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
            {/* Aviso si no ha iniciado sesión */}
            {/* FIXED: Keeps unread lint warning clean by reading out explicit profile account keys if active */}
            {!user?.id && !loading && (
              <div
                className="alert bg-dark text-warning border-warning mb-3"
                role="alert"
              >
                🔑 Log In to save your progress and unlock achievements
              </div>
            )}

            {/* Mensaje de Error */}
            {error && (
              <div
                className="alert bg-dark text-danger border-danger mb-3"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Spinner de Carga */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-cyan" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-white-50">
                  Loading your achievements...
                </p>
              </div>
            ) : (
              /* Lista de Cards de Logros */
              <div className="d-flex flex-column gap-3">
                {achievements.map((item) => (
                  <div
                    key={item.id}
                    className={`achievement-card d-flex justify-content-between align-items-center ${
                      item.unlocked ? "unlocked" : "locked"
                    }`}
                  >
                    <div>
                      <h5 className="fw-bold m-0 text-white">{item.name}</h5>
                      <p
                        className="m-0 mt-1 text-white-50"
                        style={{ fontSize: "0.9rem", fontWeight: "bold" }}
                      >
                        {item.description}
                      </p>

                      <div
                        className="mt-2 d-flex gap-3"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <span className="">
                          Points:{" "}
                          <strong className="text-white">{item.points}</strong>
                        </span>

                        <span>
                          {item.unlocked ? (
                            <span className="text-purple-light">
                              Completed at{" "}
                              {/* FIXED: Target your updated camelCase property and updated locale to 'en-US' to output text in English */}
                              {item.completedAt
                                ? new Date(item.completedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )
                                : "—"}
                            </span>
                          ) : (
                            <span className="text-warning">Uncompleted</span>
                          )}
                        </span>
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
