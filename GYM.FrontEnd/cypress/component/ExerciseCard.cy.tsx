import { ExerciseCard } from "../../src/components/ExerciseCard";

describe("<ExerciseCard />", () => {
  it("renders default values", () => {
    cy.mount(<ExerciseCard />);

    cy.contains("Exercise Name").should("exist");
    cy.contains("Exercise description").should("exist");
  });

  it("renders the provided props", () => {
    cy.mount(
      <ExerciseCard
        name="Bench Press"
        description="Chest exercise"
      />
    );

    cy.contains("Bench Press").should("exist");
    cy.contains("Chest exercise").should("exist");
  });

  it("shows sets and reps when both are provided", () => {
    cy.mount(
      <ExerciseCard
        sets={4}
        reps={12}
      />
    );

    cy.contains("4 sets × 12 reps").should("exist");
  });

  it("does not show sets and reps if one is missing", () => {
    cy.mount(
      <ExerciseCard
        sets={4}
      />
    );

    cy.contains("sets").should("not.exist");
  });

  it("calls onClick when the card is clicked", () => {
    const onClick = cy.stub().as("cardClick");

    cy.mount(
      <ExerciseCard
        onClick={onClick}
      />
    );

    cy.get(".exercise-card").click();

    cy.get("@cardClick").should("have.been.calledOnce");
  });
});