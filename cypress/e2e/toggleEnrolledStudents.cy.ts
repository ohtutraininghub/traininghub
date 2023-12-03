describe('Toggle buttons in Course modal for viewing enrolled students', () => {
  before(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  it('Toggling the view to show enrolled students is succesful for an admin user', () => {
    cy.login('admin@test.com', 'ADMIN');
    cy.contains('Robot Framework Fundamentals').click();

    cy.getCy('toggle-attendees-list').click();
    cy.getCy('enrolled-students-table').should('be.visible');

    cy.getCy('toggle-course-details').click();
    cy.getCy('enrolled-students-table').should('not.exist');
  });

  it('Toggling the view to show enrolled students is succesful for a trainer user', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.contains('Robot Framework Fundamentals').click();

    cy.getCy('toggle-attendees-list').click();
    cy.getCy('enrolled-students-table').should('be.visible');

    cy.getCy('toggle-course-details').click();
    cy.getCy('enrolled-students-table').should('not.exist');
  });

  it('The toggle buttons should not be visible for a trainee user', () => {
    cy.login('trainer@test.com', 'TRAINEE');
    cy.contains('Robot Framework Fundamentals').click();

    cy.getCy('trainer-tools').should('not.exist');
  });
});
