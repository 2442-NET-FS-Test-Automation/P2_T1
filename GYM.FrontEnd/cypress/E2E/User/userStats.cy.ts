// user stats testing
/// <reference types="cypress" />

describe('userstats', () => {
    beforeEach(() => {
        // intercept so we should get a 200 status code
        cy.intercept('GET', '**/api/stats/**').as('getStats');

        // Intercept para el guardado
        cy.intercept('POST', '**/api/stats**').as('saveStat');

        // since the get /api/stats/ requires a token auth, we need to obtain it
        cy.session('user-session', () => {
            cy.visit("http://localhost:5173/login")

            //Log in
            cy.get("input[placeholder='you@email.com']").type("user@test.com"); //Poner correo
            cy.get("input[placeholder='••••••••']").type("1234"); //Poner contraseña
            cy.contains("button", "Log In ⚔️").click(); //Click en el boton de login, contains por el texto que contiene el boton

            // 2. Esperamos el login y validamos que responda con token
            // cy.wait('@loginReq').then((interception) => {
            //     expect(interception.response?.statusCode).to.eq(200);
            // });

            // Confirm redirection after the response code ok was given
            cy.url().should('not.include', '/login');   
        })
    });

    it("user can create and see stats", () => {

        cy.visit("http://localhost:5173/user/stadistics")

        // Waits for request and assert response directly
        cy.wait('@getStats').its('response.statusCode').should('eq', 200);

        // Click on button create
        cy.contains("button", "Create new record").click();

        // Checks if the h5 exists in modal
        cy.contains("h5", "Create new record").should("exist");

        // input weight
        cy.get("input#weight").type("85");

        // input height
        cy.get("input#height").type("178");

        // input strength
        cy.get("input#strength").type("200");

        // input age
        cy.get("input#age").type("25");

        // input mileRun
        cy.get("input#mileRun").type("07:20");

        // button in Save record modal
        cy.contains("button", "Save record").click();

        // Validar que el guardado sea exitoso (200 o 201)
        cy.wait('@saveStat').its('response.statusCode').should('be.oneOf', [200, 201]);

        // Validar que la gráfica/canvas esté visible
        cy.get('.echarts-for-react canvas').should('be.visible');
    })
})