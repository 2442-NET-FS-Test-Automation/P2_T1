describe("handles changes for booking card cancellation", () => {
  it("evicts and hides card upon cancel", () => {

    cy.intercept("GET", "**/Booking/bookings/BookingByUserId", {
      fixture: "trainings.json", 
    }).as("getInitialFeed");


    cy.visit("/user/mybookings");
    cy.wait("@getInitialFeed");


    cy.get(".booking-card-wrapper").should("have.length", 3);
    cy.contains("Beginner Full Body Workout").should("be.visible");


    cy.intercept("PATCH", "**/Booking/bookings-status/1020/3", {
      statusCode: 200,
      body: { id: 1020, status: 3 } 
    }).as("cancelPatch");

    cy.intercept("GET", "**/Booking/bookings/BookingByUserId", {
      body: [],
    }).as("getEmptyFeed");

    cy.contains(".booking-card-wrapper", "Beginner Full Body Workout")
      .find(".btn-delete")
      .click();

    cy.wait("@cancelPatch");
    cy.wait("@getEmptyFeed");


    cy.contains("Beginner Full Body Workout").should("not.exist");
    cy.get(".booking-card-wrapper").should("have.length", 0);
    cy.contains("You have no active routine bookings scheduled yet.").should("exist");
  });
});