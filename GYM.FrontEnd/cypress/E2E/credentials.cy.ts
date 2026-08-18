//Login testing
/// <reference types="cypress" />

describe('Permisions check', () => {
    beforeEach(() => {
        cy.intercept(
            "GET",
            "**/api/Training/trainings",
            {
                statusCode: 200,
                body: []
            }
        ).as("getTrainings");
    })

    it("Login with user credentials and trainer/admin pannel is not visible", () => {
        cy.loginAs("user@test.com", "User")
       
        
        cy.visit("/home-user")
        cy.wait

        //Ir a nav bar
        cy.get('[title="Profile Menu"]').should("be.visible").click(); //Click en el boton de login, por el titulo del boton

        //Checar que solo tenga acceso al panel de usuario no al de trainer o admin
        cy.contains("Trainer Panel").should("not.exist"); //No ve el panel de trainer
        cy.contains("Admin Panel").should("not.exist"); //No ve el panel de admin

    })

    it("Login with trainer credentials and admin pannel is not visible", () => {
        cy.loginAs("trainer@test.com", "Trainer")
       
        cy.visit("/home-user")

        //Ir a nav bar
        cy.get('[title="Profile Menu"]').click(); //Click en el boton de login, por el titulo del boton

        //Checar que solo tenga acceso al panel de usuario no al de trainer o admin
        cy.contains("Trainer Panel").should("exist"); //No ve el panel de trainer
        cy.contains("Admin Panel").should("not.exist"); //No ve el panel de admin

    })

    it("Login with admin credentials and trainer pannel is not visible", () => {
        cy.loginAs("admin@test.com", "Admin")
       
        cy.visit("/home-user")

        //Ir a nav bar
        cy.get('[title="Profile Menu"]').click(); //Click en el boton de login, por el titulo del boton

        //Checar que solo tenga acceso al panel de usuario no al de trainer o admin
        cy.contains("Trainer Panel").should("not.exist"); //No ve el panel de trainer
        cy.contains("Admin Panel").should("exist"); //No ve el panel de admin

    })



})