describe('Course request', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('Requesting a course and removing request should be successful', () => {
    cy.login('trainee@test.com', 'TRAINEE');
    cy.contains('Request trainings').click();
    cy.contains('Git Fundamentals').click();
    cy.getCy('request-button').click();
    cy.contains('Request successfully sent!');

    cy.getCy('request-button').should('contain', 'Remove request');

    cy.getCy('request-button').click();
    cy.contains('Your request was removed');

    cy.getCy('request-button').should('contain', 'Request');
  });
});
