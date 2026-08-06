describe("handles changes for booking card cancellation", () => {
  it("evicts and hides card upon cancel", () => {
    cy.intercept("PATCH", "**/Booking/bookings-status/1020/3", {
      statusCode: 200,
    }).as("cancelPatch");

    cy.intercept("GET", "**/Booking/bookings/BookingByUserId", {
      fixture: "trainings.json",
    }).as("getEmptyFeed");

    cy.contains("Cancel Booking").click();

    cy.wait("@cancelPatch");
    cy.wait('@getEmptyFeed');

    cy.contains("Beginner Full Body Workout").should("not.exist");
    cy.contains("You have no active routine bookings scheduled yet.").should("exist");
  });

});
