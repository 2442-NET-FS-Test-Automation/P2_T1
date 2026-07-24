import "../css/Booking.css";

export function BookingFilterBar() {
  return (
    <section className="filter-bar">
      <form className="filter-form">
        <div>
          <label className="form-label text-neon small fw-semibold mb-2 d-block">
            Location
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search location..."
          />
        </div>

        <div>
          <label className="form-label text-neon small fw-semibold mb-2 d-block">
            Trainer
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search trainer..."
          />
        </div>

        <div>
          <label className="form-label text-neon small fw-semibold mb-2 d-block">
            Date
          </label>
          <input type="date" className="filter-input" />
        </div>

        <button
          type="submit"
          className="btn btn-neon w-100 py-2.5 rounded-pill fw-bold text-uppercase mt-2"
        >
          Search
        </button>
      </form>
    </section>
  );
}
