import { Role } from '@prisma/client';

const adminUser = {
  name: 'Anna Admin',
  email: 'anna@traininghub.org',
  role: Role.ADMIN,
  profileCompleted: true,
};

const fromDate = '2100-09-10';
const toDate = '2100-09-20';

describe('Exporting Course Statistics', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
    cy.login(adminUser.email, adminUser.role);

    cy.get('[aria-label^="SpeedDial"]').click();
    cy.getCy('dashboard').click();
  });

  it('should export csv file when correct dateframe is given', () => {
    cy.getCy('exportFormFromDate').type(fromDate);
    cy.getCy('exportFormToDate').type(toDate);
    cy.getCy('exportStatsButton').click();
    cy.contains('Download started');
    cy.readFile(`cypress/downloads/training-data_${fromDate}_${toDate}.csv`);
  });

  it('should not export csv file when incorrect dateframe is given', () => {
    cy.getCy('exportFormFromDate').type(toDate);
    cy.getCy('exportFormToDate').type(fromDate);
    cy.getCy('exportStatsButton').click();
    cy.contains('Invalid date range');
    cy.readFile(
      `cypress/downloads/training-data_${toDate}_${fromDate}.csv`
    ).should('not.exist');
  });
});
