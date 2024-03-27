import { Role } from '@prisma/client';

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

describe('Course participation tracking', () => {
  before(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  describe('when logged in as a trainer', () => {
    beforeEach(() => {
      cy.login(trainerUser.email, trainerUser.role);
      cy.contains('Robot Framework Fundamentals').click();
      cy.getCy('toggle-attendees-list').click();
    });

    it('allows trainer to mark course participation successfully', () => {
      cy.getCy('participation-checkbox').click();
      cy.contains('Participation marked');
    });

    it('allows trainer to unmark course participation successfully', () => {
      cy.getCy('participation-checkbox').click();
      cy.getCy('participation-checkbox').click();
      cy.contains('Participation removed');
    });
  });

  describe('when logged in as a admin', () => {
    beforeEach(() => {
      cy.login(adminUser.email, adminUser.role);
      cy.contains('Robot Framework Fundamentals').click();
      cy.getCy('toggle-attendees-list').click();
    });

    it('allows admin to mark course participation successfully', () => {
      cy.getCy('participation-checkbox').click();
      cy.contains('Participation marked');
    });

    it('allows admin to unmark course participation successfully', () => {
      cy.getCy('participation-checkbox').click();
      cy.getCy('participation-checkbox').click();
      cy.contains('Participation removed');
    });
  });
});
