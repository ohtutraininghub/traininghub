describe('Course enrollment', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('Enrolling to a course and cancelling enrollment should be successful', () => {
    cy.login('trainee@test.com', 'TRAINEE');
    cy.contains('Robot Framework Fundamentals').click();
    cy.getCy('enrollButton').click();
    cy.getCy('confirmCardConfirm').filter(':visible').click();
    cy.contains('You have enrolled for this course!');

    cy.getCy('cancelEnrollButton').click();
    cy.getCy('confirmCardConfirm').filter(':visible').click();
    cy.getCy('enrollButton').should('be.visible');
  });
});
