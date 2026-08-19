import { createTestToken } from "../../support/auth";

describe("Admin/Trainer can see user list", () => {
    beforeEach(() =>
    {
        //Login
        cy.loginAs("Cypress Admin", "Admin").as("Login");

        cy.intercept(
            "GET",
            "**/api/Training/trainings",
            {
                statusCode: 200,
                body: []
            }
        ).as("getTrainings");

        cy.intercept(
            "GET",
            "**/User/all-users",
           {
                statusCode:200,
                body:[{
                    id: 1,
                    email: "user.test@cypress.com",
                    phone: "1234567890",
                    role: "User",
                    name: "User Cypress",
                    surname: "Test",
                    joinAt: null
                }]
            }
        )
    });


    it("Check user info is display for admin", () =>
    {
        
        //Nav Bar
        cy.get('[title="Profile Menu"]').click();

        //Staff&&User
        cy.get("a.drawer-link")
            .contains("Staff & User Management")
            .click();
        cy.url().should("include", "/admin/users")
        
        //Check if 
        cy.contains("td", "user.test@cypress.com")
            .should("be.visible");
        cy.contains("td", "1234567890")
            .should("be.visible");
        cy.contains("td", "User")
            .should("be.visible");
        cy.contains("td", "User Cypress")
            .should("be.visible");
    })
});