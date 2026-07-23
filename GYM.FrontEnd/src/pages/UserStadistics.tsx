import React, { useEffect, useState } from "react";
import type { StatisticItem } from "../types/userStadistics";
import { getUserStatistics } from "../api/stadistics";

// Tus componentes de gráficas ya conectados
import { WeeklyMilesChart } from "../components/WeeklyMilesChart";
import { StrengthProgressChart } from "../components/StrengthProgressChart";
import "../css/UserStadistics.css";

// Datos de prueba (Fallback)
const FALLBACK_WEEKLY_MILES = [1.2, 0, 3.5, 2.0, 0, 4.1, 1.5];
const FALLBACK_STRENGTH_DATES = ["01 Jul", "05 Jul", "10 Jul", "15 Jul", "20 Jul"];
const FALLBACK_STRENGTH_VALUES = [100, 115, 135, 155, 185];

export const UserStatistics: React.FC = () => {
  const [stats, setStats] = useState<StatisticItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getUserStatistics();
        
        // VALIDACIÓN ANTI-ERROR: Nos aseguramos de que realmente sea un Array
        if (Array.isArray(data)) {
          setStats(data);
        } else {
          console.warn("La respuesta de la API no es un arreglo válido:", data);
          setStats([]);
        }
      } catch (error) {
        console.warn("Servicio no disponible, usando datos de prueba.", error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Comprobación segura del array de estadísticas
  const hasValidStats = Array.isArray(stats) && stats.length > 0;
  const latestStat = hasValidStats ? stats[0] : null;

  // Adaptación de datos para la gráfica de fuerza
  const strengthDates = hasValidStats
    ? stats.map((s) => new Date(s.measureAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })).reverse()
    : FALLBACK_STRENGTH_DATES;

  const strengthValues = hasValidStats
    ? stats.map((s) => s.strength).reverse()
    : FALLBACK_STRENGTH_VALUES;

  // Datos para millas semanales
  const milesData = FALLBACK_WEEKLY_MILES;

  return (
    <div className="stats-page space-y-8">
      {/* Encabezado */}
      <div className="border-b border-[#282a42] pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Mi Rendimiento</h1>
          <p className="text-sm stats-text-purple mt-1">Evolución de fuerza, distancia y métricas corporales</p>
        </div>
        {!hasValidStats && !loading && (
          <span className="stats-badge-demo">
            Modo Demostración
          </span>
        )}
      </div>

      {/* Métricas clave */}
      <div className="stats-metrics-banner grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Peso Actual</p>
          <p className="text-2xl font-bold text-white mt-1">
            {latestStat ? latestStat.weight : 75.5} <span className="text-sm font-normal stats-text-muted">kg</span>
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Altura</p>
          <p className="text-2xl font-bold text-white mt-1">
            {latestStat ? latestStat.height : 178} <span className="text-sm font-normal stats-text-muted">cm</span>
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Fuerza Máxima</p>
          <p className="text-2xl font-bold stats-text-cyan mt-1">
            {latestStat ? latestStat.strength : 185} <span className="text-sm font-normal stats-text-muted">lbs</span>
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Mejor Milla</p>
          <p className="text-2xl font-bold stats-text-cyan mt-1">
            {latestStat ? latestStat.milerun : "06:15"}
          </p>
        </div>
      </div>

      {/* Gráficas activas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica 1: Millas Semanales */}
        <div className="stats-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
            <span>Millas Recorridas</span>
            <span className="text-xs stats-text-purple font-normal">Semana actual</span>
          </h3>
          <div className="pt-2">
            <WeeklyMilesChart milesData={milesData} />
          </div>
        </div>

        {/* Gráfica 2: Progresión de Fuerza */}
        <div className="stats-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
            <span>Progresión de Fuerza</span>
            <span className="text-xs stats-text-purple font-normal">Histórico</span>
          </h3>
          <div className="pt-2">
            <StrengthProgressChart dates={strengthDates} strengthValues={strengthValues} />
          </div>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div className="stats-card">
        <h3 className="text-lg font-semibold text-white mb-4">Historial de Mediciones</h3>
        {loading ? (
          <p className="text-sm stats-text-muted">Cargando mediciones...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Peso</th>
                  <th>Altura</th>
                  <th>Fuerza</th>
                  <th>Tiempo Milla</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {(hasValidStats
                  ? stats
                  : [
                      { id: 1, measureAt: "2026-07-20", weight: 75.5, height: 178, strength: 185, milerun: "06:15" },
                      { id: 2, measureAt: "2026-07-15", weight: 76.0, height: 178, strength: 155, milerun: "06:30" },
                      { id: 3, measureAt: "2026-07-10", weight: 76.8, height: 178, strength: 135, milerun: "06:45" },
                    ]
                ).map((item) => (
                  <tr key={item.id}>
                    <td className="text-white font-medium">
                      {new Date(item.measureAt).toLocaleDateString()}
                    </td>
                    <td>{item.weight} kg</td>
                    <td>{item.height} cm</td>
                    <td className="stats-text-cyan font-semibold">{item.strength} lbs</td>
                    <td className="stats-text-purple font-mono">{item.milerun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};