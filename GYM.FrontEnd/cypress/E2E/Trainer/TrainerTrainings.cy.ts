// user stats testing
/// <reference types="cypress" />

// /Training/trainings
describe('trainer exercises page -> CRUD', () => {
    beforeEach(() => {
        // intercept so we should get a 200 status code
        cy.intercept('GET', '**/api/Training/trainings**').as('getTrainings');

        // Intercept para el guardado
        cy.intercept('POST', '**/api/Training/trainings**').as('saveTraining');

        // intercept for editing trainings
        cy.intercept('PUT', '**/api/Training/trainings**').as('editTraining');

        // intercept for deleting trainings
        cy.intercept('DELETE', '**/api/Training/training/**').as('deleteTraining');


        // since the get /api/Training/exercises/ requires a token auth, we need to obtain it
        cy.session('trainer-session', () => {
            cy.visit("http://localhost:5173/login")

            //Log in
            cy.get("input[placeholder='you@email.com']").type("trainer@test.com"); //Poner correo
            cy.get("input[placeholder='••••••••']").type("1234"); //Poner contraseña
            cy.contains("button", "Log In ⚔️").click(); //Click en el boton de login, contains por el texto que contiene el boton

            // Confirm redirection after the response code ok was given
            cy.url().should('not.include', '/login');   
        }, {
            cacheAcrossSpecs: true // This option allows the session to be cached across different spec files
        })

            cy.visit("http://localhost:5173/admin/trainings");

            // Esperas la petición y asertas sobre la respuesta directamente
            cy.wait('@getTrainings').its('response.statusCode').should('eq', 200);
    });

    it("trainer can create trainings [200/201 status] -> Ok", () => {

        // cy.wait('@getTrainings').its('response.statusCode').should('eq', 200);

        // Click on button create training
        cy.contains("button", "➕ ").click();

        // Checks if the h5 exists in modal
        cy.contains("h5", "➕ Create New Training").should("exist");

        // input Traning name
        cy.get("input[placeholder='e.g. Upper Body Blast']").type("Beginner Fullbody workout");

        // textarea Description
        cy.get("textarea[placeholder='Focus on chest, back and shoulders...']").type("Focus on full body, beginner workout");

        // select Place
        cy.get("#place-input").select("Gym");

        // input Difficulty
        cy.get("input[placeholder='Easy, Medium...']").clear().type("Beginner");

        // input Calories
        cy.get('[data-cy="calories-input"]').clear().type("300");

        // input Est. Time (HH:mm:ss)
        cy.get("input[placeholder='00:45:00']").clear().type("00:30:00");

        // checkboxes -> Select exercises
        cy.get("input#ex-check-1").click();

        cy.get("input#ex-check-2").click();

        cy.get("input#ex-check-4").click();

        cy.get("input#ex-check-9").click();

        cy.get("input#ex-check-10").click();

        cy.get("input#ex-check-12").click();

        // button in Save training records modal
        cy.contains("button", "Create Routine").click();

        // Validar que el guardado sea exitoso (200 o 201)
        cy.wait('@saveTraining').its('response.statusCode').should('be.oneOf', [200, 201]);
    })

    it("trainer can create trainings [400 status] -> Bad Request", () => {
        // cy.wait('@getTrainings').its('response.statusCode').should('eq', 200);

        // Click on button create training
        cy.contains("button", "➕ ").click();

        // Checks if the h5 exists in modal
        cy.contains("h5", "➕ Create New Training").should("exist");

        // input Traning name
        cy.get("input[placeholder='e.g. Upper Body Blast']").type("Beginner Gym Fullbody workout");

        // textarea Description
        cy.get("textarea[placeholder='Focus on chest, back and shoulders...']").type("Focus on full body, beginner workout at gym");

        // select Place
        cy.get("#place-input").select("Gym");

        // input Difficulty
        cy.get("input[placeholder='Easy, Medium...']").clear().type("Beginner");

        // input Calories
        cy.get('[data-cy="calories-input"]').clear().type("-300");

        // input Est. Time (HH:mm:ss)
        cy.get("input[placeholder='00:45:00']").clear().type("-00:30:00");

        // checkboxes -> Select exercises
        cy.get("input#ex-check-1").click();

        cy.get("input#ex-check-2").click();

        cy.get("input#ex-check-4").click();

        cy.get("input#ex-check-9").click();

        cy.get("input#ex-check-10").click();

        cy.get("input#ex-check-12").click();

        // button in Save training records modal
        cy.contains("button", "Create Routine").click();

        // Bad request expected to be received (400)
        cy.wait('@saveTraining').its('response.statusCode').should('eq', 400);
    })

    it("trainer can edit trainings", () => {

        // edit button
        cy.contains("button", "✏️").click();

        cy.contains("h5", "✏️ Edit Training Routine");

        // input Traning name
        cy.get("input[placeholder='e.g. Upper Body Blast']").clear().type("Intermediate Home Fullbody workout");

        // textarea Description
        cy.get("textarea[placeholder='Focus on chest, back and shoulders...']").clear().type("Focus on full body, intermediate workout at home");

        // select Place
        cy.get("#place-input").select("Home");

        // input Difficulty
        cy.get("input[placeholder='Easy, Medium...']").clear().type("Intermediate");

        // input Calories
        cy.get('[data-cy="calories-input"]').clear().type("40");

        // input Est. Time (HH:mm:ss)
        cy.get("input[placeholder='00:45:00']").clear().type("00:30:00");

        // checkboxes -> Select exercises
        cy.get("input#ex-check-1").click();

        cy.get("input#ex-check-2").click();

        cy.get("input#ex-check-4").click();

        cy.get("input#ex-check-11").click();

        cy.get("input#ex-check-10").click();

        cy.get("input#ex-check-12").click();

        // button to confirm edited training records modal
        cy.contains("button", "Save Changes").click();

        cy.wait('@editTraining').its('response.statusCode').should('be.oneOf', [200, 204]);
    })

    it("trainer can delete trainigs", () => {
        cy.on("window:confirm", (message) => {
            expect(message).to.eq("¿Estás seguro de que deseas eliminar esta rutina? (Los ejercicios base de la librería NO se borrarán).")
            return true
        })

        cy.contains("button","🗑️").click();

        cy.wait('@deleteTraining').its('response.statusCode').should('be.oneOf', [200, 204]);
    });
})