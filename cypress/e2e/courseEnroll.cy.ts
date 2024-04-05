import { Role } from '@prisma/client';

const traineeUser = {
  name: 'Bob Johnson',
  email: 'bob.johnson@example.com',
  role: Role.TRAINEE,
};

describe('Course enrollment', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  it('Enrolling to a course and cancelling enrollment should be successful', () => {
    cy.login(traineeUser.email, traineeUser.role);
    cy.contains('Robot Framework Fundamentals').click();
    cy.getCy('enrollButton').click();
    cy.getCy('confirmCardConfirm').filter(':visible').click();
    cy.getCy('calendarPromptDecline').click();
    cy.contains('You have enrolled for this course!');

    cy.getCy('cancelEnrollButton').click();
    cy.getCy('confirmCardConfirm').filter(':visible').click();
    cy.getCy('enrollButton').should('be.visible');
  });
});
