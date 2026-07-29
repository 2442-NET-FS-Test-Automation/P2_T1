import { DifficultyCircles } from "./DifficultyCircles";
import { useState } from "react";

// Explicit status configuration dictionaries for clean UI rendering
const STATUS_META: Record<
  number,
  { label: string; color: string; nextLabel: string | null }
> = {
  0: { label: "Booked", color: "#64748b", nextLabel: "Mark in progress" },
  1: { label: "Working", color: "#eab308", nextLabel: "Mark as complete" },
  2: { label: "Completed", color: "#22c55e", nextLabel: null },
  3: { label: "Cancelled", color: "#ef4444", nextLabel: null },
};

interface BookingCardProps {
  trainingName?: string;
  trainer?: string;
  location?: string;
  exerciseCount?: number;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Heroic";
  description?: string;
  duration?: string;
  imageUrl?: string;
  calories?: number;
  onBook?: () => void;
  isMyBookingFeed?: boolean;
  onViewExercises?: () => void;
  status?: number;
  onStatusChange?: (nextStatus: number) => void;
  onDelete?: () => void;
}

export function BookingCard({
  trainingName = "Full Body HIIT",
  //trainer = "Coach Alex",
  //location = "Main Studio - Room A",
  exerciseCount = 8,
  difficulty = "Beginner",
  description = "A high-intensity circuit training session focused on core stability, aerobic threshold endurance, and explosive full-body movement patterns.",
  duration = "45 mins",
  imageUrl = "https://wp.com",
  calories = 150,
  location = "Main Arena 2",
  onBook,
  isMyBookingFeed = false,
  onViewExercises,
  status = 0,
  onStatusChange,
  onDelete,
}: BookingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentStatusMeta = STATUS_META[status] || STATUS_META[0];

  return (
    <div className={`booking-card-wrapper ${isExpanded ? "expanded" : ""}`}>
      <div
        className="booking-card"
        style={{
          borderLeft: isMyBookingFeed
            ? `5px solid ${currentStatusMeta.color}`
            : "none",
        }}
      >
        <img src={imageUrl} alt={trainingName} />

        <div className="booking-card-details">
          <div className="detail-a">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h3>{trainingName}</h3>

              {/* FIX: Only show the badge bubble indicator if we are explicitly on the personal My Bookings feed panel */}
              {isMyBookingFeed && (
                <span
                  className="badge font-monospace text-uppercase"
                  style={{
                    backgroundColor: `${currentStatusMeta.color}22`,
                    color: currentStatusMeta.color,
                    border: `1px solid ${currentStatusMeta.color}`,
                    fontSize: "0.65rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {currentStatusMeta.label}
                </span>
              )}
            </div>

            {/* <h4>{trainer}</h4> */}

            <div
              className="card-metadata small mt-1"
              style={{ color: "#bfbfbf" }}
            >
              {/* <div className="d-flex align-items-center gap-1 mb-1">
                <span>{location}</span>
              </div> */}
              <div className="d-flex align-items-center gap-1">
                <span>{exerciseCount} Exercises</span>
              </div>
            </div>

            {/* ANCHOR MET: Dynamic Difficulty Mapping Node Layout */}
            <div className="mt-2 d-flex align-items-center gap-2">
              <span
                className="text-neon small text-uppercase fw-semibold"
                style={{ fontSize: "0.75rem" }}
              >
                Intensity:
              </span>
              <DifficultyCircles level={difficulty} />
            </div>
          </div>

          <div className="detail-b">
            <div className="card-button-wrapper">
              {isMyBookingFeed ? (
                <>
                  {currentStatusMeta.nextLabel && onStatusChange && (
                    <button
                      className="primary"
                      onClick={() => onStatusChange(status + 1)}
                      style={{
                        backgroundColor: status === 0 ? "#eab308" : "#22c55e",
                        color: "#0f172a",
                      }}
                    >
                      {currentStatusMeta.nextLabel}
                    </button>
                  )}

                  <button
                    className="secondary"
                    onClick={onViewExercises}
                    style={{ border: "1px solid #00e5ff", color: "#00e5ff" }}
                  >
                    Track Exercises ➔
                  </button>

                  {status !== 2 && onDelete && (
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents layout row toggle conflicts
                        onDelete();
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </>
              ) : (
                <button className="primary" onClick={onBook}>
                  Book Now
                </button>
              )}

              <button
                className={`secondary ${isExpanded ? "active-btn" : ""}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide Details" : "Details"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deployable Drawer Content Node Box */}
      <div className="booking-card-drawer">
        <div className="drawer-inner-content">
          <div className="drawer-grid">
            <div className="drawer-description">
              <h5>About this Workout</h5>
              <p>{description}</p>
            </div>
            <div className="drawer-specs">
              <div className="spec-badge">⏱️ {duration}</div>
              <div className="spec-badge">🔥 {calories} </div>
              <div className="spec-badge">📍 {location} </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
