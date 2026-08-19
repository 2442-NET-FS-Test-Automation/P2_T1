//Login testing
/// <reference types="cypress" />

describe('register', () => {

    //Siempre ir a la pagina de register
    beforeEach(() => {
        
    });

    it("Register with valid credentials", () => {
        cy.intercept(
            "POST",
            "**/authentication/register",
            (req) => {
                expect(req.body).to.deep.equal({
                    email:"test@test.com", 
                    password:"123456A", 
                    phone:"1234567890"
                });
                req.reply({
                    statusCode:200,
                    body:{
                        email: "user.test@cypress.com",
                        password: "123456A",
                        phone: "1234567890"
                    }
                });
        }).as("register");

        cy.visit("http://localhost:5173/register");
        cy.get('input[type="email"]')
            .type("test@test.com");

        cy.get('input[type="tel"]')
            .type("1234567890");

        cy.get('input[type="password"]')
            .first()
            .type("123456A");

        cy.get('input[type="password"]')
            .last()
            .type("123456A");

        cy.contains("button", "Register ⚔️")
            .click();
        
        cy.contains("Account Created!")
            .should("be.visible");

    })
})