import { Role } from '@prisma/client';

const adminUser = {
  name: 'Anna Admin',
  email: 'anna@traininghub.org',
  role: Role.ADMIN,
  profileCompleted: true,
};

describe('Admin view', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
    cy.login(adminUser.email, adminUser.role);

    cy.get('[aria-label^="SpeedDial"]').click();
    cy.getCy('dashboard').click();
  });

  it('admin dashboard should be accessible', () => {
    cy.get('h1').contains('Admin dashboard');
  });

  it('titlelist should be accessible', () => {
    cy.get('h2').contains('Titles');
  });

  it('countrylist should be accessible', () => {
    cy.get('h2').contains('Countries');
  });

  it('taglist should be accessible', () => {
    cy.get('h2').contains('Tags');
  });

  it('user list should be accessible', () => {
    cy.get('h2').eq(2).contains('Users');
  });
  it('should be possible to visit user profile', () => {
    cy.get('a').contains('Alice Smith').click();
    cy.get('h3').contains('Alice Smith');
  });
});
