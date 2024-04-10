import { Role } from '@prisma/client';

const traineeUser = {
  name: 'Taylor Trainee',
  email: 'taylor@traininghub.org',
  role: Role.TRAINEE,
};

const adminUser = {
  name: 'Anna Admin',
  email: 'anna@traininghub.org',
  role: Role.ADMIN,
};

describe('Cypress login', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  it('login should be successfull using credentials', () => {
    cy.login(traineeUser.email, traineeUser.role);
    cy.getCy('avatarIconButton').should('be.visible');
  });

  it('should be possible to access admin dashboard when logged in as admin', () => {
    cy.login(adminUser.email, adminUser.role);
    cy.visit('/admin/dashboard');
    cy.getCy('tagSubmitButton').should('be.visible');
  });
});
