Cypress.Commands.add('getCy', (selector) => {
  return cy.get(`[data-testid=${selector}]`);
});

Cypress.Commands.add('login', (email, role) => {
  cy.visit('/');
  cy.get('#input-email-for-credentials-provider').type(`${email}`);
  cy.get('#input-role-for-credentials-provider').type(`${role}{enter}`);
});
