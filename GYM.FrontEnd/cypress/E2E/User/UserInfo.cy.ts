import { createTestToken } from "../../support/auth";

describe("User can edit userinformation ", () => {

    beforeEach(() => {
        cy.loginAs("Cypress User", "User");
        
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
            "**/stats/user",
            {
                statusCode:200,
                body:[
                {
                    "id": 1,
                    "userId": 1,
                    "weight": 75,
                    "height": 175,
                    "strength": 88,
                    "mileRun": "12:30",
                    "measureAt": "2026-08-18T10:00:00Z",
                    "age": 24
                }]
            }
        ).as("userStats");

        cy.intercept(
            "GET",
            "**/User/users-details",
            {
                statusCode:200,
                body:{
                    gender: "Male",
                    name: "UserCypress",
                    surname: "Test",
                    joinAt: "2026-08-18T10:00:00Z",
                    age: 24
                }
            }
        ).as("userInfo")

        cy.intercept(
            "PUT",
            "**/User/users-details",
            {
                statusCode: 200,
                body: {
                    gender: "Male",
                    name: "Cypress",
                    surname: "Updated",
                    joinAt: "2026-08-18T10:00:00Z",
                    age: 24
                }
            }
        ).as("updateUser");

    });

    it("Get to user info and edit it", () => {
        //Ir a /home-user
        cy.visit("/home-user");
        cy.get('[title="Profile Menu"]').click();

        cy.get("a.drawer-link")
            .contains("User Configuration")
            .click();
        cy.url().should("include", "/user/profileSettings")

        //Confirmar la información

        cy.wait("@userStats");
        cy.contains(".stats-value", "75 kg")
            .should("be.visible");

        cy.contains(".stats-value", "175 cm")
            .should("be.visible");

        cy.contains(".stats-value", "75 kg")
            .should("be.visible");

        cy.contains(".stats-value", "24")
            .should("be.visible");

        cy.wait("@userInfo");
        cy.get("#firstName").should("have.value", "UserCypress");
        cy.get("#lastName").should("have.value", "Test");

        //Modificar la info
        cy.get("#firstName").clear().type("NewName");
        cy.get("#lastName").clear().type("NewLastName");

        //Click
        cy.get(".update-btn")
            .contains("Update")
            .click();
        
        cy.wait("@updateUser")
        cy.contains("Profile updated successfully!")
            .should("be.visible");

        
        //MOdificar la información
        //COnfirmar la modificación
       
    });
});