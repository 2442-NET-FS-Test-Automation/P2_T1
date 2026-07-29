import React, { useEffect, useState } from "react";
import type { StatsDTO } from "../types/StatsDTO";
import { getUserStatistics } from "../api/stadistics";
import { UserStatsModal } from "../Components/UserStatsModal";

// Tus componentes de gráficas ya conectados
import { MonthlyMilesChart } from "../Components/MonthlyMilesChart";
import { StrengthProgressChart } from "../Components/StrengthProgressChart";
import "../css/UserStadistics.css";
import "../css/UserStatsModal.css";

// Datos de prueba (Fallback)
const FALLBACK_STRENGTH_DATES = ["01 Jul", "05 Jul", "10 Jul", "15 Jul", "20 Jul"];
const FALLBACK_STRENGTH_VALUES = [100, 115, 135, 155, 185];

export const UserStatistics: React.FC = () => {
  const [stats, setStats] = useState<StatsDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getUserStatistics();

      // VALIDACIÓN ANTI-ERROR: Nos aseguramos de que realmente sea un Array
      if (Array.isArray(data)) {
        const sorted = [...data].sort(
          (a, b) => new Date(b.measureAt).getTime() - new Date(a.measureAt).getTime()
        );
        setStats(sorted);
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

  useEffect(() => {
    fetchStats();
  }, []);

  // Comprobación segura del array de estadísticas
  const hasValidStats = Array.isArray(stats) && stats.length > 0;
  const latestStat = hasValidStats ? stats[0] : null;

  // Adaptación de datos para la gráfica de fuerza
  const strengthDates = hasValidStats
    ? stats.map((s) => new Date(s.measureAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })).reverse()
    : FALLBACK_STRENGTH_DATES;

  const parseMileRunToMinutes = (mileRun: string): number => {
    if (!mileRun) return 0;

    const [timePart, fractionPart = ""] = mileRun.split(".");
    const parts = timePart.split(":").map(Number);
    const fractionSeconds = Number(`0.${fractionPart}`) || 0;

    if (parts.length === 3) {
      const [h, m, seconds] = parts;
      return h * 60 + m + (seconds + fractionSeconds) / 60;
    }

    if (parts.length === 2) {
      const [m, seconds] = parts;
      return m + (seconds + fractionSeconds) / 60;
    }

    return Number(timePart) || 0;
  };

  const formatMileRun = (mileRun: string): string => {
    if (!mileRun) return "00:00:00";

    const cleaned = mileRun.trim();
    const [timePart, fraction = ""] = cleaned.split(".");
    const timeParts = timePart.split(":").map((part) => part.padStart(2, "0"));
    const normalizedTime = timeParts.join(":");

    if (!fraction) return normalizedTime;

    const normalizedFraction = fraction.replace(/[^0-9]/g, "").slice(0, 2).padEnd(2, "0");
    return `${normalizedTime}.${normalizedFraction}`;
  };

  const strengthValues = hasValidStats
    ? stats.map((s) => s.strength).reverse()
    : FALLBACK_STRENGTH_VALUES;

  // Estado del mes seleccionado (por default, el mes actual)
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    if (!hasValidStats) return;
    const latestDate = new Date(latestStat?.measureAt ?? stats[0].measureAt);
    const monthValue = `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(monthValue);
  }, [stats, hasValidStats, latestStat]);

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
        result[dayIndex] += parseMileRunToMinutes(s.mileRun);
      }
    });

    return result;
  }, [stats, hasValidStats, selectedMonth]);

  const hasChartData = milesData.some((value) => value > 0);

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
            <button
              type="button"
              className="btn btn-info"
              style={{ borderRadius: "20px" }}
              onClick={() => setIsModalOpen(true)}>
              Create new record
            </button>

            {isModalOpen && (
              <UserStatsModal onClose={() => setIsModalOpen(false)} onCreated={fetchStats} />
            )}
          </div>
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
              {latestStat ? latestStat.strength : 185} <span className="text-sm font-normal stats-text-muted">Kg</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider stats-text-purple">Mile run record</p>
            <p className="text-2xl font-bold stats-text-cyan mt-1">
              {latestStat ? formatMileRun(latestStat.mileRun) : "06:15"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Date filter */}
          <div className="stats-filter-row">
            <label htmlFor="stats-month-selector" className="stats-filter-label">Select month</label>
            <input
              id="stats-month-selector"
              type="month"
              className="stats-filter-input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
          {/* chart 1: miles per month */}
          <div className="stats-card">
            <h3 className="text-lg font-semibold text-white mb-4 d-flex align-items-center">
              <span>Mile run performance</span>
              <span className="text-xs stats-text-purple font-normal ms-3">This month</span>
            </h3>
            <div className="pt-2">
              <MonthlyMilesChart
                milesData={milesData}
                dayLabels={dayLabels}
                monthLabel={monthLabel}
              />
              {!hasChartData && (
                <p className="text-sm stats-text-muted mt-3">No mile run data for this month.</p>
              )}
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
                      <td className="stats-text-cyan font-semibold">{item.strength} kg</td>
                      <td className="stats-text-purple font-mono">{formatMileRun(item.mileRun)}</td>
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
}
