/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

import { Role } from '@prisma/client';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      getByDataTestId(selector: string): Chainable<JQuery<HTMLElement>>;
      login(email: string, role: Role): Chainable<void>;
    }
  }
}

Cypress.Commands.add('getByDataTestId', (selector) => {
  return cy.get(`[data-testid=${selector}]`);
});

Cypress.Commands.add('login', (email, role) => {
  cy.visit('/');
  cy.get('#input-email-for-credentials-provider').type(`${email}`);
  cy.get('#input-role-for-credentials-provider').type(`${role}{enter}`);
});
