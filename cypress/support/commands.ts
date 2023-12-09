Cypress.Commands.add('getCy', (selector) => {
  return cy.get(`[data-testid=${selector}]`);
});

Cypress.Commands.add('login', (email, role) => {
  cy.visit('/');
  cy.get('#input-email-for-credentials-provider').type(`${email}`);
  cy.get('#input-role-for-credentials-provider').type(`${role}{enter}`);
});

Cypress.Commands.add('formatDate', (value, year) => {
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - year);
  const formattedDate = currentDate.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  cy.getCy(value).then(($element) => {
    if ($element.find('CLEAR').length > 0) {
      cy.contains('CLEAR')
        .click()
        .then(() => {
          cy.getCy(value).type(`${formattedDate}`);
        });
    } else {
      cy.getCy(value).type(`${formattedDate}`);
    }
  });
});
