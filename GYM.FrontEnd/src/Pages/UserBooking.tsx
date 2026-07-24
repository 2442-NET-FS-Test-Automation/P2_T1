import { useState } from "react";
import { BookingFilterBar } from "../components/BookingFilterBar";
import { BookingCard } from "../components/BookingCard";
import "../css/Booking.css";

export function UserBooking() {
  const [sortBy, setSortBy] = useState("date-asc");
  return (
    <>
      <div className="bookings">
        <BookingFilterBar />
        <section className="bookingsContainer">
          {/* Header Section with Flex layout */}
          <div className="bookings-header-row">
            <h2>Bookings</h2>

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
                <option value="date-asc">Date (Oldest First)</option>
                <option value="date-desc">Date (Newest First)</option>
                <option value="trainer-az">Trainer (A - Z)</option>
                <option value="location-az">Location (A - Z)</option>
              </select>
            </div>
          </div>
          <div className="booking-list-container">
            <BookingCard
              title="Yoga Mobility"
              trainer="Sarah J."
              location="Downtown Wellness Center"
              exerciseCount={6}
              difficulty="easy"
            />
            <BookingCard
              title="Functional Strength"
              trainer="Coach Alex"
              location="Gym Floor Zone B"
              exerciseCount={12}
              difficulty="medium"
            />
            <BookingCard
              title="Powerlifting Level 2"
              trainer="Marcus V."
              location="The Barbell Dungeon"
              exerciseCount={5}
              difficulty="hard"
            />
          </div>
        </section>
      </div>
    </>
  );
}
