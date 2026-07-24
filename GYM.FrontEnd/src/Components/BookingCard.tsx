import { DifficultyCircles } from "./DifficultyCircles";

interface BookingCardProps {
  title?: string;
  trainer?: string;
  location?: string;          // New property
  exerciseCount?: number;     // New property
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function BookingCard({ 
  title = "Full Body HIIT", 
  trainer = "Coach Alex", 
  location = "Main Studio - Room A",
  exerciseCount = 8,
  difficulty = "medium"
}: BookingCardProps) {
  return (
    <div className="booking-card">
      {/* 1. Left Image Graphic */}
      <img
        src="https://i0.wp.com/css-tricks.com/wp-content/uploads/2012/10/threelines.png" alt={title} />

      {/* 2. Middle Text Details Section */}
      <div className="booking-card-details">
        <div className="detail-a">
          <h3>{title}</h3>
          <h4>{trainer}</h4>
          
          {/* Location & Exercise Count Metadata */}
          <div className="card-metadata small mt-1" style={{ color: '#bfbfbf' }}>
            <div className="d-flex align-items-center gap-1 mb-1">
              {location}
            </div>
            <div className="d-flex align-items-center gap-1">
              {exerciseCount} Exercises
            </div>
          </div>
          
          {/* Difficulty Circles Badge */}
          <div className="mt-2 d-flex align-items-center gap-2">
            <span className="text-neon small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
              Intensity:
            </span>
            <DifficultyCircles level={difficulty} />
          </div>
        </div>

        {/* 3. Right Interactive Buttons */}
        <div className="detail-b">
          <div className="card-button-wrapper">
            <button className="primary" onClick={() => console.log("Booking Confirmed!")}>
              Book Now
            </button>
            <button className="secondary" onClick={() => console.log("Details Open")}>
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



