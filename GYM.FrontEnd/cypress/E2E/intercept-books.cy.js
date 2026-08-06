describe("bookings feed interception", () => {
  // Intercepting the API call to get all bookings
  beforeEach(() => {
    // Intercept the API call and feed it mock data matching your exact Step 3 C# DTO structure
    cy.intercept("GET", "**/Booking/bookings/BookingByUserId", {
      fixture: "trainings.json",
    }).as("getUserBookings");

    cy.visit("/user/mybooking");
    cy.wait("@getUserBookings");
  });

  it("populates card rows", () => {
    cy.contains("Beginner Full Body Workout").should("exist");
    cy.contains("3 Exercises").should("exist");
    cy.contains("Booked").should("exist");
  });
});
