/* eslint-disable no-unused-vars */
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

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      getByDataTestId(seletor: string): Chainable<JQuery<HTMLElement>>;
      login(email: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('getByDataTestId', (selector) => {
  return cy.get(`[data-testid=${selector}]`);
});

Cypress.Commands.add('login', (email) => {
  cy.visit('/');
  cy.get('#input-email-for-credentials-provider').type(`${email}{enter}`);
});
