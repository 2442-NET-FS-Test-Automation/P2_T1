// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import "@cypress/code-coverage/support"
import compareSnapshotCommand from 'cypress-image-diff-js';
// --- ADD THIS TO THE BOTTOM OF cypress/support/e2e.ts ---

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log into the application with mock user session contexts.
       * @example cy.loginAs("Cypress User", "User")
       */
      loginAs(username: string, role: string): Chainable<void>;
    }
  }
}


compareSnapshotCommand();