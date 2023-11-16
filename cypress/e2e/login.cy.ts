describe('Cypress login', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
  });

  it('login should be successfull using credentials', () => {
    cy.login('testuser@test.com', 'TRAINEE');
    cy.getCy('avatarIconButton').should('be.visible');
  });

  it('should be possible to access tag creation page when logged in as admin', () => {
    cy.login('testuser@test.com', 'ADMIN');
    cy.visit('/admin/create-tag');
    cy.getCy('tagSubmitButton').should('be.visible');
  });
});
