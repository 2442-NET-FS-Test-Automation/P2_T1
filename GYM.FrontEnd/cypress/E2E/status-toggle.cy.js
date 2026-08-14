describe("advances card status from Booked to Working on click", () => {
  beforeEach(() => {
    // 1. Initial Page Load: Feed the "Booked" snapshot file
    cy.intercept("GET", "**/Booking/bookings/BookingByUserId", {
      fixture: "trainings.json",
    }).as("getInitialFeed");

    cy.visit("/user/mybookings");
    cy.wait("@getInitialFeed");
  });

  it("advances card status from Booked to Working on click using fixtures", () => {
    const targetBookingId = 1020;

    // 2. Intercept the PATCH mutation request
    cy.intercept("PATCH", `**/Booking/bookings-status/${targetBookingId}/1`, {
      statusCode: 200,
      body: { id: targetBookingId, status: 1 },
    }).as("startWorkoutToggle");

    cy.intercept("GET", "**/Booking/bookings/BookingByUserId", {
      fixture: "trainings.json",
    }).as("getUpdatedBookings");

    cy.contains("Start Workout ➔").click();

    cy.wait("@startWorkoutToggle");
    cy.wait("@getUpdatedBookings");
    cy.contains("Working").should("exist");
    cy.contains("Complete Session ✓").should("exist");
  });
});
