import { createTestToken } from "../support/auth";

describe("User can see achievements", () => {

    beforeEach(() => {
        cy.intercept(
        "GET",
        "**/authentication/me",
        {
            statusCode: 200,
            body: {
                id: 1,
                role: "User",
                email: "user@test.com"
            }
        }
        ).as("getUser");

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

        cy.visit("/user/achievements", {
            onBeforeLoad(win) {
                win.localStorage.setItem(
                    "gym.token",
                    createTestToken("Cypress User", "User")
                );
            }
        });
    });

    it("See achievements", () => {

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