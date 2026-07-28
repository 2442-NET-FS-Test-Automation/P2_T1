import { DifficultyCircles } from "./DifficultyCircles";
import { useState } from "react";

interface BookingCardProps {
  trainingName?: string;
  trainer?: string;
  location?: string;          
  exerciseCount?: number;     
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Heroic';
  description?: string;
  duration?: string;
  imageUrl?: string;
  onBook?: () => void;
}

export function BookingCard({ 
  trainingName = "Full Body HIIT", 
  trainer = "Coach Alex", 
  location = "Main Studio - Room A",
  exerciseCount = 8,
  difficulty = "Intermediate",
  description = "A high-intensity circuit training session focused on core stability, aerobic threshold endurance, and explosive full-body movement patterns.",
  duration = "45 mins",
  imageUrl = "https://i0.wp.com/css-tricks.com/wp-content/uploads/2012/10/threelines.png",
  onBook
}: BookingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (

 /* Wrapper handles the full container including the hidden drawer */
    <div className={`booking-card-wrapper ${isExpanded ? 'expanded' : ''}`}>
      
      {/* Main Visible Row */}
      <div className="booking-card">
        <img src={imageUrl} alt={trainingName} />

        <div className="booking-card-details">
          <div className="detail-a">
            <h3>{trainingName}</h3>
            <h4>{trainer}</h4>
            
            <div className="card-metadata small mt-1" style={{ color: '#bfbfbf' }}>
              <div className="d-flex align-items-center gap-1 mb-1">
                <span> {location}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span> {exerciseCount} Exercises</span>
              </div>
            </div>
            
            <div className="mt-2 d-flex align-items-center gap-2">
              <span className="text-neon small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                Intensity:
              </span>
              <DifficultyCircles level={difficulty} />
            </div>
          </div>

          <div className="detail-b">
            <div className="card-button-wrapper">
              <button className="primary" onClick={(onBook)}>
                Book Now
              </button>
              {/* Added toggle handler here */}
              <button 
                className={`secondary ${isExpanded ? 'active-btn' : ''}`} 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide Details" : "Details"}
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* Deployable Details Drawer Element */}
      <div className="booking-card-drawer">
        <div className="drawer-inner-content">
          <div className="drawer-grid">
            <div className="drawer-description">
              <h5>About this Workout</h5>
              <p>{description}</p>
            </div>
            <div className="drawer-specs">
              <div className="spec-badge">⏱️ {duration}</div>
              <div className="spec-badge">🔥 ~450 kcal</div>
              <div className="spec-badge">👟 Bring Clean Shoes</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}



