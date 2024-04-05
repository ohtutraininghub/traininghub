import { Role } from '@prisma/client';

const adminUser = {
  name: 'Anna Admin',
  email: 'anna@traininghub.org',
  role: Role.ADMIN,
};

describe('User list in admin dashboard', () => {
  beforeEach(() => {
    // Intercepting the session request to get the user ID
    cy.intercept('GET', `/api/auth/session`).as('getUser');

    cy.task('clearDatabase');
    cy.task('seedDatabase');
    cy.login(adminUser.email, adminUser.role);

    // Wait for the intercepted request to complete
    cy.wait('@getUser').then((interception) => {
      cy.wrap(interception?.response?.body?.user.id).as('userId');
    });

    // Visit the dashboard after login
    cy.get('[aria-label^="SpeedDial"]').click();
    cy.getCy('dashboard').click();
  });

  describe('when using filter row', () => {
    it('displays logged user when searched by name', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('tbody>tr>th').contains(adminUser.name);
      cy.get('tbody>tr>th').contains(adminUser.email);
      cy.get('tbody>tr>th').contains('admin');
    });

    it('displays logged user when searched by email', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Email').type(adminUser.email);
      cy.get('tbody>tr>th').contains(adminUser.name);
      cy.get('tbody>tr>th').contains(adminUser.email);
      cy.get('tbody>tr>th').contains('admin');
    });
  });

  describe('when updating role', () => {
    it('displays confim card when another role is selected', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-role-select`).click();
      });
      cy.get('[data-value="TRAINEE"]').click();
      cy.getCy('small-confirm-card').should('be.visible');
    });

    it('keeps old role if cancel button is pressed', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-role-select`).click();
      });
      cy.get('[data-value="TRAINEE"]').click();
      cy.getCy('cancel-button').click();
      cy.getCy('small-confirm-card').should('not.exist');
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-role-select`).find('p').should('contain', 'admin');
      });
    });

    it('updates role when confirm button is pressed', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-role-select`).click();
      });
      cy.get('[data-value="TRAINEE"]').click();
      cy.getCy('confirm-button').click();
      cy.getCy('small-confirm-card').should('not.exist');
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-role-select`)
          .find('p')
          .should('contain', 'trainee');
      });
    });
  });

  describe('when updating country', () => {
    it('displays confim card when another country is selected', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-country-select`).click();
      });
      cy.get('[data-value="clumicdtg0003fyakdum2yzdv"]').click();
      cy.getCy('small-confirm-card').should('be.visible');
    });

    it('keeps old country if cancel button is pressed', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-country-select`).click();
      });
      cy.get('[data-value="clumicdtg0003fyakdum2yzdv"]').click();
      cy.getCy('cancel-button').click();
      cy.getCy('small-confirm-card').should('not.exist');
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-country-select`)
          .find('p')
          .should('contain', 'Finland');
      });
    });

    it('updates country when confirm button is pressed', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-country-select`).click();
      });
      cy.get('[data-value="clumicdtg0003fyakdum2yzdv"]').click();
      cy.getCy('confirm-button').click();
      cy.getCy('small-confirm-card').should('not.exist');
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-country-select`)
          .find('p')
          .should('contain', 'Germany');
      });
    });
  });

  describe('when updating title', () => {
    it('displays confim card when another title is selected', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-title-select`).click();
      });
      cy.get('[data-value="clum4qgfw000008k095npgxwe"]').click();
      cy.getCy('small-confirm-card').should('be.visible');
    });

    it('keeps old title if cancel button is pressed', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-title-select`).click();
      });
      cy.get('[data-value="clum4qgfw000008k095npgxwe"]').click();
      cy.getCy('cancel-button').click();
      cy.getCy('small-confirm-card').should('not.exist');
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-title-select`)
          .find('p')
          .should('contain', 'Management');
      });
    });

    it('updates title when confirm button is pressed', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type(adminUser.name);
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-title-select`).click();
      });
      cy.get('[data-value="clum4qgfw000008k095npgxwe"]').click();
      cy.getCy('confirm-button').click();
      cy.getCy('small-confirm-card').should('not.exist');
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-title-select`)
          .find('p')
          .should('contain', 'Employee');
      });
    });
  });
});
