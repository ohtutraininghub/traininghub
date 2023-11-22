describe('Cypress login', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
  });

  it('login should be successfull using credentials', () => {
    cy.login('testuser@test.com', 'TRAINEE');
    cy.getCy('avatarIconButton').should('be.visible');
  });

  it('should be possible to access admin dashboard when logged in as admin', () => {
    cy.login('testuser@test.com', 'ADMIN');
    cy.visit('/admin/dashboard');
    cy.getCy('tagSubmitButton').should('be.visible');
  });
});
