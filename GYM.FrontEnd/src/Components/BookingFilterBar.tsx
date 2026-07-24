import "../css/Booking.css";

export function BookingFilterBar() {
  return (
    <section className="filter-bar">
      <form className="filter-form">
        {/* Input Email */}
        <div className="mb-3">
          <label className="form-label text-neon small fw-semibold">
            Location
          </label>

          <div className="input-group">
            <input
              type="text"
              className="filter-input filter-location"
              placeholder="Location"
            />
          </div>
        </div>

        {/* Input Password */}
        <div className="mb-3">
          <label className="form-label text-neon small fw-semibold">
            Trainer
          </label>

          <div className="input-group">
            <input
              type="text"
              className="filter-input filter-trainer"
              placeholder="Trainer"
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label text-neon small fw-semibold">
            Date
          </label>

          <div className="input-group">
            <input
              type="date"
              className="filter-input filter-date"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-neon w-100 py-2.5 rounded-pill fw-bold text-uppercase shadow-neon"
        >
          "Search"
        </button>
      </form>
    </section>
  );
}
