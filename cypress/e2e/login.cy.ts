describe('Cypress login', () => {
  it('login should be successfull using credentials', () => {
    cy.login('testuser@test.com');
    cy.getByDataTestId('avatarIconButton').should('be.visible');
  });
});
