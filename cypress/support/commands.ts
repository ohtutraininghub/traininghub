Cypress.Commands.add('getCy', (selector) => {
  return cy.get(`[data-testid=${selector}]`);
});

Cypress.Commands.add('login', (email, role) => {
  cy.visit('/');
  cy.get('#input-email-for-credentials-provider').type(`${email}`);
  cy.get('#input-role-for-credentials-provider').type(`${role}{enter}`);
});

//https://github.com/mui/material-ui/issues/29468
Cypress.Commands.add('chooseDatePicker', (selector: string, value: string) => {
  cy.get('body').then(($body) => {
    const mobilePickerSelector = `${selector} input[readonly]`;
    const isMobile = $body.find(mobilePickerSelector).length > 0;
    if (isMobile) {
      // The MobileDatePicker component has readonly inputs and needs to
      // be opened and clicked on edit so its inputs can be edited
      cy.get(mobilePickerSelector).click();
      cy.get(
        '[role="dialog"] [aria-label="calendar view is open, go to text input view"]'
      ).click();
      cy.get(`[role="dialog"] ${selector}`).find('input').clear().type(value);
      cy.contains('[role="dialog"] button', 'OK').click();
    } else {
      cy.getCy(selector).clear().type(value);
    }
  });
});
