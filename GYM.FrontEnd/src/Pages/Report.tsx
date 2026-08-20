import { useEffect, useState } from "react";
import { getPublicStats } from "../services/UserStatService";
import { ReportCard } from "../Components/ReportCard";
import "../css/Report.css";
import type { StatsDTO } from "../types/StatsDTO";

export function Report() {
  const [sortBy, setSortBy] = useState("date-desc");
  const [stats, setStats] = useState<StatsDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Execute sorting rules directly over the master stats state collection
  const finalProcessedData = [...stats].sort((a, b) => {
    const dateA = new Date(a.measureAt).getTime();
    const dateB = new Date(b.measureAt).getTime();

    return sortBy === "date-asc" 
      ? dateA - dateB 
      : dateB - dateA;
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const data = await getPublicStats();

      if (!data || data.length === 0) {
        setStats([
          {
            id: 1,
            userId: 10,
            weight: 83.5,
            height: 180,
            strength: 150,
            mileRun: "00:07:30",
            measureAt: "2026-04-01",
            age: 24,
          },
          {
            id: 2,
            userId: 10,
            weight: 81.2,
            height: 180,
            strength: 170,
            mileRun: "00:07:05",
            measureAt: "2026-05-15",
            age: 24,
          },
          {
            id: 3,
            userId: 10,
            weight: 79.5,
            height: 180,
            strength: 195,
            mileRun: "00:06:45",
            measureAt: "2026-07-20",
            age: 24,
          },
        ]);
      } else {
        setStats(data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="reports">
        <section className="reportsContainer">
          <div className="reports-header-row">
            <h2>Fitness Progress Logs</h2>

            <div className="sort-wrapper">
              <label
                htmlFor="sort-select"
                className="text-neon small fw-semibold"
              >
                Sort By:
              </label>
              <select
                id="sort-select"
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Date (Newest first)</option>
                <option value="date-asc">Date (Oldest first)</option>
              </select>
            </div>
          </div>

          <div className="report-list-container">
            {loading ? (
              <p>Loading report data...</p>
            ) : stats.length === 0 ? (
              <p>No logged metrics found for this user.</p>
            ) : (
              finalProcessedData.map((stat) => {
                return (
                  <ReportCard
                    key={stat.id}
                    date={stat.measureAt}
                    weight={`${stat.weight} kg`}
                    height={`${stat.height} cm`}
                    strength={`Level ${stat.strength}`}
                    mileTime={stat.mileRun}
                    age={`${stat.age} yrs`}
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </>
  );
}
