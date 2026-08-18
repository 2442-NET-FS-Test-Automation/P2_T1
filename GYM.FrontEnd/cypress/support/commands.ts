/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import { createTestToken } from "../support/auth";

declare global {
    namespace Cypress {
        interface Chainable{ //aqui añadir los comandos que se requieran en cypress para testing
            login(email : string, password:string): Chainable<void>,
            loginAs(name: string, role: string): Chainable<void>
        }
    }
}

export {};

Cypress.Commands.add("login", (email : string, password : string) => {
    cy.request("POST", "http://localhost:5076/authentication/login", {email, password})
        .then(({body}) => {
            window.localStorage.setItem("gym.token", body.token)
        });
})

Cypress.Commands.add(
    "loginAs",
    (name: string, role: string) => {
        cy.visit("/login", {
            onBeforeLoad(win) {
                win.localStorage.setItem(
                    "gym.token",
                    createTestToken(name, role)
                );
            }
        });

        cy.intercept(
            "GET",
            "**/authentication/me",
            {
                statusCode: 200,
                body: {
                    id: 1,
                    name,
                    role
                }
            }
        ).as("getUser");
    }
);