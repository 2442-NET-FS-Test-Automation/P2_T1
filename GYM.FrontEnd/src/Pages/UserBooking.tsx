import Navbar from "../components/Navbar";
import { BookingFilterBar } from "../components/BookingFilterBar";
import { BookingCard } from "../components/BookingCard";
import "../css/Booking.css";

export function UserBooking() {
  return (
    <>
      <Navbar onLogout={() => console.log("Cerrando sesión...")} />
      <div className="bookings">
        <BookingFilterBar />
        <section className="bookingsContainer">
          <h2>Booking</h2>
          <div className="booking-list-container">
            <BookingCard />
            <BookingCard />
            <BookingCard />
            <BookingCard />
          </div>
        </section>
      </div>
    </>
  );
}
