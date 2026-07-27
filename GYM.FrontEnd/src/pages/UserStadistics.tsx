import React, { useEffect, useState } from "react";
import type { StatsDTO } from "../types/StatsDTO";
import { getUserStatistics } from "../api/stadistics";

// Tus componentes de gráficas ya conectados
import { MonthlyMilesChart } from "../components/MonthlyMilesChart";
import { StrengthProgressChart } from "../components/StrengthProgressChart";
import "../css/UserStadistics.css";

// Datos de prueba (Fallback)
const FALLBACK_WEEKLY_MILES = [1.2, 0, 3.5, 2.0, 0, 4.1, 1.5];
const FALLBACK_STRENGTH_DATES = ["01 Jul", "05 Jul", "10 Jul", "15 Jul", "20 Jul"];
const FALLBACK_STRENGTH_VALUES = [100, 115, 135, 155, 185];

// Helper: devuelve el lunes de la semana actual a las 00:00
const getMondayOfCurrentWeek = (): Date => {
  const now = new Date();
  const day = now.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  const diff = day === 0 ? -6 : 1 - day; // si es domingo, retrocede 6 días
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export const UserStatistics: React.FC = () => {
  const [stats, setStats] = useState<StatsDTO[]>([]);
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

  // Estado del mes seleccionado (por default, el mes actual)
const [selectedMonth, setSelectedMonth] = React.useState(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
});

const milesData = React.useMemo(() => {
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr) - 1; // JS Date usa 0-11

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result = new Array(daysInMonth).fill(0);

  if (!hasValidStats) return result;

  stats.forEach((s) => {
    const measureDate = new Date(s.measureAt);
    if (measureDate.getFullYear() === year && measureDate.getMonth() === month) {
      const dayIndex = measureDate.getDate() - 1; // día 1 -> índice 0
      const [h, m, sec] = s.mileRun.split(":").map(Number);
      result[dayIndex] += h * 60 + m + sec / 60;
    }
  });

    return result;
  }, [stats, hasValidStats, selectedMonth]);

  const dayLabels = React.useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
  }, [selectedMonth]);

  const monthLabel = React.useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const date = new Date(Number(yearStr), Number(monthStr) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  return (
    <div>
      <div className="stats-page space-y-8">
        {/* Encabezado */}
        <div className="border-b border-[#282a42] pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Your stats 💪</h1>
            <p className="text-sm stats-text-purple mt-1">Progression of strength, distance, and body metrics</p>
          </div>
          {!hasValidStats && !loading && (
            <span className="stats-badge-demo">
              Demo
            </span>
          )}
        </div>

        {/* Métricas clave */}
        <div className="stats-metrics-banner grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Weight</p>
            <p className="text-2xl font-bold text-white mt-1">
              {latestStat ? latestStat.weight : 75.5} <span className="text-sm font-normal stats-text-muted">kg</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Height</p>
            <p className="text-2xl font-bold text-white mt-1">
              {latestStat ? latestStat.height : 178} <span className="text-sm font-normal stats-text-muted">cm</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Max strength</p>
            <p className="text-2xl font-bold stats-text-cyan mt-1">
              {latestStat ? latestStat.strength : 185} <span className="text-sm font-normal stats-text-muted">lbs</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Mile run record</p>
            <p className="text-2xl font-bold stats-text-cyan mt-1">
              {latestStat ? latestStat.mileRun : "06:15"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Date filter */}
          <div className="d-flex justify-content-start mb-2">
            <input 
            type="month"
            className="form-control bg-dark text-white border-secondary"
            style={{width: 'auto'}}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)} 
            />
          </div>
          {/* chart 1: miles per month */}
          <div className="stats-card">
            <h3 className="text-lg font-semibold text-white mb-4 d-flex align-items-center">
              <span>Miles runned</span>
              <span className="text-xs stats-text-purple font-normal ms-3">This month</span>
            </h3>
            <div className="pt-2">
              <MonthlyMilesChart 
              milesData={milesData} 
              dayLabels={dayLabels} 
              monthLabel={monthLabel}
              />
            </div>
          </div>

          {/* Chart 2: Strength progress */}
          <div className="stats-card mt-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex align-items-center">
              <span>Strength Progress</span>
              <span className="text-xs stats-text-purple font-normal ms-3">This month</span>
            </h3>
            <div className="pt-2">
              <StrengthProgressChart dates={strengthDates} strengthValues={strengthValues} />
            </div>
          </div>
        </div>

        {/* Tabla de Historial */}
        <div className="stats-card mt-4">
          <h3 className="text-lg font-semibold text-white mb-4">Measurement records</h3>
          {loading ? (
            <p className="text-sm stats-text-muted">Loading measures...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Weight</th>
                    <th>Height</th>
                    <th>Strength</th>
                    <th>Mile time</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {(hasValidStats
                    ? stats
                    : [
                      { id: 1, measureAt: "2026-07-20", weight: 75.5, height: 178, strength: 185, mileRun: "06:15" },
                      { id: 2, measureAt: "2026-07-15", weight: 76.0, height: 178, strength: 155, mileRun: "06:30" },
                      { id: 3, measureAt: "2026-07-10", weight: 76.8, height: 178, strength: 135, mileRun: "06:45" },
                    ]
                  ).map((item) => (
                    <tr key={item.id}>
                      <td className="text-white font-medium">
                        {new Date(item.measureAt).toLocaleDateString()}
                      </td>
                      <td>{item.weight} kg</td>
                      <td>{item.height} cm</td>
                      <td className="stats-text-cyan font-semibold">{item.strength} lbs</td>
                      <td className="stats-text-purple font-mono">{item.mileRun}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};