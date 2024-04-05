describe('Admin view', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.login('admin@test.com', 'ADMIN');
    cy.get('[aria-label^="SpeedDial"]').click();
    cy.getCy('dashboard').click();
  });

  it('admin dashboard should be accessible', () => {
    cy.get('h1').contains('Admin dashboard');
  });

  it('taglist should be accessible', () => {
    cy.get('h2').contains('Tags');
  });

  it('user list should be accessible', () => {
    cy.get('h2').eq(2).contains('Users');
  });
});
