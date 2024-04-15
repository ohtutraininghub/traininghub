import { Role } from '@prisma/client';

const traineeUser = {
  name: 'Taylor Trainee',
  email: 'taylor@traininghub.org',
  role: Role.TRAINEE,
};

const trainerUser = {
  name: 'Tim Trainer',
  email: 'tim@traininghub.org',
  role: Role.TRAINER,
};

const adminUser = {
  name: 'Anna Admin',
  email: 'anna@traininghub.org',
  role: Role.ADMIN,
};

describe('Toggle buttons in Course modal for viewing enrolled students', () => {
  before(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  it('Toggling the view to show enrolled students is succesful for an admin user', () => {
    cy.login(adminUser.email, adminUser.role);
    cy.contains('Robot Framework Fundamentals').click();

    cy.getCy('toggle-attendees-list').click();
    cy.getCy('enrolled-students-table').should('be.visible');

    cy.getCy('toggle-course-details').click();
    cy.getCy('enrolled-students-table').should('not.exist');
  });

  it('Toggling the view to show enrolled students is succesful for a trainer user', () => {
    cy.login(trainerUser.email, trainerUser.role);
    cy.contains('Robot Framework Fundamentals').click();

    cy.getCy('toggle-attendees-list').click();
    cy.getCy('enrolled-students-table').should('be.visible');

    cy.getCy('toggle-course-details').click();
    cy.getCy('enrolled-students-table').should('not.exist');
  });

  it('The toggle buttons should not be visible for a trainee user', () => {
    cy.login(traineeUser.email, traineeUser.role);
    cy.contains('Robot Framework Fundamentals').click();

    cy.getCy('trainer-tools').should('not.exist');
  });
});
