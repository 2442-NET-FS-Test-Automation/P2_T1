import "../css/ExerciseDetail.css";

interface ExerciseDetailProps {
  name?: string;
  description?: string;
  visualReferenceUrl?: string;
  sets?: number;
  reps?: number;
}

export function ExerciseDetail({
  name = "Barbell Romanian Deadlift",
  description = "Focus on hinging at the hips while maintaining a neutral spine. Lower the barbell down your shins until you feel a deep stretch in your hamstrings, then engage glutes to return upright.",
  visualReferenceUrl = "https://i0.wp.com/css-tricks.com/wp-content/uploads/2012/10/threelines.png", // Safe default photo fallback
  sets = 4,
  reps = 10
}: ExerciseDetailProps) {
  return (
    <div className="exercise-detail-page">
      <div className="detail-container">
        
        {/* Left Column: Visual Media Container */}
        <section className="media-column">
          <div className="media-wrapper">
            {visualReferenceUrl ? (
              <img 
                src={visualReferenceUrl} 
                alt={`${name} visual execution guide`} 
                className="visual-reference"
              />
            ) : (
              <div className="media-placeholder">
                <span>📷 No Media Reference Available</span>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Descriptions and Target Parameter Values */}
        <section className="info-column">
          <div className="info-header">
            <span className="accent-label text-neon">Exercise Tutorial</span>
            <h1>{name}</h1>
          </div>

          {/* Target Set/Rep Volume Blocks */}
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-title">Target Sets</span>
              <div className="metric-value">{sets}</div>
              <span className="metric-sub">rounds</span>
            </div>
            <div className="metric-card">
              <span className="metric-title">Target Reps</span>
              <div className="metric-value">{reps}</div>
              <span className="metric-sub">per set</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="description-card">
            <h3>Execution Instructions</h3>
            <p>{description}</p>
          </div>

          {/* Footer Action Navigation Section */}
          <div className="action-footer">
            <button className="btn-back" onClick={() => window.history.back()}>
              ← Back to Training
            </button>
            <button className="btn-complete">
              Mark Completed ✓
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
