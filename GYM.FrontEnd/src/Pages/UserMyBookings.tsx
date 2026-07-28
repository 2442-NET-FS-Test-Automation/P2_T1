// /user/mybookings

import { BookingCard } from "../components/BookingCard";
import "../css/Booking.css";
export function UserMyBookings() {
  return (
    <>
      <section className="trainingDetail">
        <div className="text-center py-5 text-white">
          <h2 className="fw-bold" style={{ letterSpacing: "0.5px" }}>
            Your bookings
          </h2>
        </div>
        <div className="list-container">
          <section className="exercise-list">
            <BookingCard />
            <BookingCard />
            <BookingCard />
            <BookingCard />
          </section>
        </div>
      </section>
    </>
  );
}
