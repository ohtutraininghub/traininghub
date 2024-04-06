import { Role } from '@prisma/client';

const traineeUser = {
  name: 'Ella Moore',
  email: 'ella.moore@example.com',
  role: Role.TRAINEE,
};

describe('Complete profile', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
    cy.login(traineeUser.email, traineeUser.role);
  });
  describe('when using navigation', () => {
    it('should not move to profile page', () => {
      cy.getCy('avatarIconButton').click();
      cy.getCy('viewProfileMenuItem').click();
      cy.contains('Complete your profile');
    });
    it('should not move to home page', () => {
      cy.getCy('avatarIconButton').click();
      cy.getCy('homeMenuItem').click();
      cy.contains('Complete your profile');
    });
  });
  describe('when completing profile', () => {
    it('should display error message when submitting empty fields', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('A country is required');
      cy.contains('A title is required');
    });
    it('should display success message when submitted successfully', () => {
      cy.getCy('country-select').click();
      cy.get('[data-value="clum4qgfw000008k095npgxsx"]').click();
      cy.getCy('title-select').click();
      cy.get('[data-value="clum4qgfw000008k095npgxwe"]').click();
      cy.get('button[type="submit"]').click();
      cy.contains('User info successfully updated!');
    });
  });
});
