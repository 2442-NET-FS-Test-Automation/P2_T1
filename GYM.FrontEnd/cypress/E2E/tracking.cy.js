describe("tracks the exercise through browser", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/Booking/bookings/BookingByUserId", {
      fixture: "trainings.json",
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
    cy.get(".exercise-list .exercise-card, .exercise-list section").should(
      "exist",
    );
  });

  it("passes the exercise detail", () => {
    cy.get(".booking-card-wrapper")
      .eq(0)
      .within(() => {
        cy.contains("Track Exercises ➔").click();
      });

    cy.url().should("include", "/training");
    cy.get("h2").should("contain", "Beginner Full Body Workout");

    cy.get(".exercise-list").find("button, .exercise-card, h3").first().click();

    cy.url().should("include", "/exercise/");

    cy.contains("Back to My Bookings, ←, Return").click({ force: true });
  });
});
