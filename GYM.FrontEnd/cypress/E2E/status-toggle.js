describe("advances card status from Booked to Working on click", () => {
  cy.intercept("PATCH", "**/Booking/bookings-status/1020/1", {
    statusCode: 200,
    fixture: "trainings.json",
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
