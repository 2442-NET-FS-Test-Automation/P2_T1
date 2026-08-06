import { BookingCard } from "../../src/components/BookingCard";

describe("<BookingCard />", () => {
  it("renders default values", () => {
    cy.mount(<BookingCard isMyBookingFeed={false} />);

    cy.contains("Full Body HIIT").should("exist");
    cy.contains(
      "A high-intensity circuit training session focused on core stability, aerobic threshold endurance, and explosive full-body movement patterns.",
    ).should("exist");

    cy.contains("Details").click();
    cy.contains(
      "A high-intensity circuit training session focused on core stability, aerobic threshold endurance, and explosive full-body movement patterns.",
    ).should("exist");
  });

  it("renders the provided props", () => {
    cy.mount(
      <BookingCard
        trainingName="Beginner Full Body Workout"
        description="A beginner-friendly full-body workout that can be performed at home with little to no equipment."
      />,
    );

    cy.contains("Details").click();
    cy.contains(
      "A beginner-friendly full-body workout that can be performed at home with little to no equipment.",
    ).should("exist");
  });

  it("shows duration, calories and location when they are provided", () => {
    cy.mount(
      <BookingCard
        location="Home"
        duration="30 mins"
        exerciseCount={5}
        isMyBookingFeed={false}
      />,
    );

    // Verified: Location is rendered directly in the visible section metadata row
    cy.contains("Home").should("exist");
    cy.contains("5 Exercises").should("exist");

    // Open the drawer to read the specs box elements
    cy.contains("Details").click();
    cy.contains("30 mins").should("exist");
  });

  it("calls onBook when the book now button is clicked", () => {
    const onBookSpy = cy.stub().as("bookClick");

    cy.mount(<BookingCard onBook={onBookSpy} isMyBookingFeed={false} />);

    // Targets the "Book Now" primary action button
    cy.get(".primary").click();

    cy.get("@bookClick").should("have.been.calledOnce");
  });
});
