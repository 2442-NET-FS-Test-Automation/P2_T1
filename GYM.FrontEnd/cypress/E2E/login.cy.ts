//Login testing


/// <reference types="cypress" />

describe('login', () => {

    //Antes del login queremos estar en el lugar indicado
    beforeEach(() => {
        cy.visit("http://localhost:5173/login");
    });

    it("Log in con credenciales validas", () => {
        //Log in
        cy.get("input[placeholder='you@email.com']").type("user@test.com"); //Poner correo
        cy.get("input[placeholder='••••••••']").type("1234"); //Poner contraseña
        cy.contains("button", "Log In ⚔️").click(); //Click en el boton de login, contains por el texto que contiene el boton

        //Ir a nav bar
        cy.get('[title="Profile Menu"]').click(); //Click en el boton de login, por el titulo del boton

        //Log out
        cy.contains("button", "Log Out").click();

        //Confirmar Log out
        cy.contains("h2", "Log in to your account").click();


    })
})