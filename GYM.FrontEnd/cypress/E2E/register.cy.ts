//Login testing
/// <reference types="cypress" />

describe('register', () => {

    //Siempre ir a la pagina de register
    beforeEach(() => {
        cy.visit("http://localhost:5173/register");
    });

    it("Register with valid credentials", () => {
        //Log in
        cy.get("input[placeholder='you@email.com']").type("user@test.com"); //Poner correo
        cy.get("input[placeholder='••••••••']").type("1234"); //Poner contraseña
        cy.contains("button", "Log In ⚔️").click(); //Click en el boton de login, contains por el texto que contiene el boton

        cy.url().should("include", "/home-user");

        //Checar que el token se guarde
        cy.window().then((win) => {
            const token = win.localStorage.getItem("gym.token");

            expect(token).to.not.be.null;
            expect(token).to.not.be.empty;
        });

    })
})