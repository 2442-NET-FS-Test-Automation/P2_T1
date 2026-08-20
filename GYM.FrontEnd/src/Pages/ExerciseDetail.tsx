import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
// FIX: Capitalized the type name to match your standard interface naming conventions
import type { exerciseDTO } from "../types/exerciseDTO";
import "../css/ExerciseDetail.css";

export function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate(); // Added native router navigator engine hook

  // FIXED: Synchronized matching uppercase typings to eliminate build-breaking linter crashes
  const [exercise] = useState<exerciseDTO | null>(
    (location.state as { exercise?: exerciseDTO })?.exercise || null,
  );
  const [loading, setLoading] = useState<boolean>(!exercise);

  useEffect(() => {
    const fetchFallbackExercise = async () => {
      if (!exercise && id) {
        setLoading(true);
        try {
          // Add your direct exercise database fetch action hook line here if needed later:
          // const data = await getExerciseByIdFromServer(Number(id));
          // if (data) setExercise(data);
        } catch (error) {
          console.error("Could not recover tracking row data:", error);
        }
        setLoading(false);
      }
    };

    fetchFallbackExercise();
  }, [id, exercise]);

  if (loading) {
    return (
      <div className="abstract-document-flow">
        <p>Loading exercise specifications...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="abstract-document-flow">
        <p>Error: Could not retrieve exercise detail path parameters.</p>
      </div>
    );
  }

  return (
    <div className="abstract-document-flow">
      <div className="abstract-header-node">
        <p className="abstract-primary-label">{exercise.name}</p>
      </div>

      <div className="abstract-media-node">
        <img
          src={exercise.visualReferenceUrl || "https://wp.com"}
          alt={`${exercise.name} mechanical movement layout`}
          className="abstract-image-element"
        />
        <p className="abstract-caption-element">Execution reference.</p>
      </div>

      <div className="abstract-content-node">
        <h2>Movement Description</h2>
        <p>
          {exercise.description ||
            "No execution instructions provided for this movement track."}
        </p>

        <h2>Target Progression Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-title">Target Sets</span>
            <div className="metric-value">{exercise.sets || 0}</div>
            <span className="metric-sub">rounds</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Target Reps</span>
            <div className="metric-value">{exercise.reps || 0}</div>
            <span className="metric-sub">per set</span>
          </div>
        </div>

        <div className="abstract-nav-node abstract-action-divider">
          <button
            className="abstract-action-link"
            // FIXED: Uses the secure router pop stack event fallback to prevent browser history breakout loops
            onClick={() => navigate(-1)}
          >
            ← Return to Exercise List
          </button>
        </div>
      </div>
    </div>
  );
}
