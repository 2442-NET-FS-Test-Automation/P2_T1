import "../css/Booking.css";

export function BookingCard() {
  return (
    <section className="booking-card">
      <img
        src="https://i0.wp.com/css-tricks.com/wp-content/uploads/2012/10/threelines.png"
        alt=""
      />
      <div className="booking-card-details">
        <div className="detail-a">
          <h3>Custom routine name</h3>
          <p>Location</p>
          <p>Trainer</p>
          <p>Exercise number</p>
        </div>
        <div className="detail-b">
          <div className="detail-b-content-1">
            <h5>Difficulty</h5>
          </div>
          <div className="book-element-section">
            <div className="card-button-wrapper">
              <button className="secondary">View Details</button>
              <button className="primary">Book</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
