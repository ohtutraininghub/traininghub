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
    cy.contains(day).click();
    cy.get(`[aria-label="${hours} hours"]`)
      .invoke('css', 'pointer-events', 'auto')
      .click();
    cy.get(`[aria-label="${minutes} minutes"]`)
      .invoke('css', 'pointer-events', 'auto')
      .click();
    cy.get('[aria-label="PM"]').invoke('css', 'pointer-events', 'auto').click();
    cy.contains('OK').click();
  }

  if (value === 'nextMonth') {
    cy.get('[aria-label="Next month"]').click();
    cy.contains(day).click();
    cy.get(`[aria-label="${hours} hours"]`)
      .invoke('css', 'pointer-events', 'auto')
      .click();
    cy.get(`[aria-label="${minutes} minutes"]`)
      .invoke('css', 'pointer-events', 'auto')
      .click();
    cy.get('[aria-label="PM"]').invoke('css', 'pointer-events', 'auto').click();
    cy.contains('OK').click();
  }

  if (value === 'previousMonth') {
    cy.get('[aria-label="Previous month"]').click();
    cy.contains(day).click();
    cy.get(`[aria-label="${hours} hours"]`)
      .invoke('css', 'pointer-events', 'auto')
      .click();
    cy.get(`[aria-label="${minutes} minutes"]`)
      .invoke('css', 'pointer-events', 'auto')
      .click();
    cy.get('[aria-label="PM"]').invoke('css', 'pointer-events', 'auto').click();
    cy.contains('OK').click();
  }
});
