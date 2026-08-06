describe("tracks the exercise through browser", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/Booking/bookings/BookingByUserId", {
      fixture: "bookings.json",
    }).as("getBookingsFeed");

    cy.visit("/user/mybookings");
    cy.wait("@getBookingsFeed");
  });

  it("passes exercise list", () => {
    cy.get(".booking-card-wrapper")
      .eq(0)
      .within(() => {
        cy.contains("Track Exercises ➔").click();
      });

    cy.url().should("include", "/training");
    cy.get("h2").should("contain", "Beginner Full Body Workout");
    cy.contains("Intensity: Easy").should("exist");
    cy.get(".exercise-card").should("have.length", 3);
  });

  it("passes the exercise detail", () => {
    cy.get(".booking-card-wrapper")
      .eq(0)
      .within(() => {
        cy.contains("Track Exercises ➔").click();
      });

    cy.url().should("include", "/training");
    cy.get("h2").should("contain", "Beginner Full Body Workout");
    cy.contains()
  });
});
