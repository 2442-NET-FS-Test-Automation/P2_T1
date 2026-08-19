import { createTestToken } from "../../support/auth";

describe("User can see achievements", () => {

    beforeEach(() => {
        cy.loginAs("Cypress User", "User")

        cy.intercept(
            "GET",
            "**/api/Achievement/allAchievements",
            {
                fixture: "achivements.json"
            }
        ).as("getAchievements");

        cy.intercept(
            "GET",
            "**/api/Achievement/AchievementByUserId",
            {
                fixture: "userAchivements.json"
            }
        ).as("getUserAchievements");

    });

    it("See achievements", () => {

        cy.visit("/user/achievements")
        cy.wait("@getAchievements");
        

        cy.contains("First Workout").should("exist");
        cy.contains("10 Workouts").should("exist");
        cy.contains("Getting Started").should("exist");


        cy.wait("@getUserAchievements");
        cy.contains("First Workout")
            .closest(".achievement-card")
            .should("have.class", "unlocked");

        cy.contains("Getting Started")
            .closest(".achievement-card")
            .should("have.class", "unlocked");

        cy.contains("10 Workouts")
            .closest(".achievement-card")
            .should("have.class", "locked");
    });
});