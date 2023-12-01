Cypress.Commands.add('getCy', (selector) => {
  return cy.get(`[data-testid=${selector}]`);
});

Cypress.Commands.add('login', (email, role) => {
  cy.visit('/');
  cy.get('#input-email-for-credentials-provider').type(`${email}`);
  cy.get('#input-role-for-credentials-provider').type(`${role}{enter}`);
});

Cypress.Commands.add('setDate', (element, value, day, hours, minutes) => {
  cy.wait(2000);
  cy.wrap(element).click();
  if (value === 'currentMonth') {
    cy.contains(day).click({ force: true });
    cy.get(`[aria-label="${hours} hours"]`).click({ force: true });
    cy.get(`[aria-label="${minutes} minutes"]`).click({ force: true });
    cy.get('[aria-label="PM"]').click({ force: true });
    cy.contains('OK').click({ force: true });
  }

  if (value === 'nextMonth') {
    cy.get('[aria-label="Next month"]').click({ force: true });
    cy.contains(day).click({ force: true });
    cy.get(`[aria-label="${hours} hours"]`).click();
    cy.get(`[aria-label="${minutes} minutes"]`).click();
    cy.get('[aria-label="PM"]').click({ force: true });
    cy.contains('OK').click({ force: true });
  }

  if (value === 'previousMonth') {
    cy.get('[aria-label="Previous month"]').click({ force: true });
    cy.contains(day).click({ force: true });
    cy.get(`[aria-label="${hours} hours"]`).click({ force: true });
    cy.get(`[aria-label="${minutes} minutes"]`).click({ force: true });
    cy.get('[aria-label="PM"]').click({ force: true });
    cy.contains('OK').click({ force: true });
  }
});
