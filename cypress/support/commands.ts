Cypress.Commands.add('getCy', (selector) => {
  return cy.get(`[data-testid=${selector}]`);
});

Cypress.Commands.add('login', (email, role) => {
  cy.visit('/');
  cy.get('#input-email-for-credentials-provider').type(`${email}`);
  cy.get('#input-role-for-credentials-provider').type(`${role}{enter}`);
});

Cypress.Commands.add('setDate', (element, value, day) => {
  cy.wait(2000);
  cy.wrap(element).click();

  const selectDate = (day) => cy.contains(day).click();

  switch (value) {
    case 'currentMonth':
      selectDate(day);
      break;

    case 'nextMonth':
      cy.get('[aria-label="Next month"]').click();
      selectDate(day);
      break;

    case 'previousMonth':
      cy.get('[aria-label="Previous month"]').click();
      selectDate(day);
      break;
  }

  cy.then(() => {
    cy.contains('OK').click();
  });
});
