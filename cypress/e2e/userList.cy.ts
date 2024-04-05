describe('User list in admin dashboard', () => {
  beforeEach(() => {
    // Intercepting the session request to get the user ID
    cy.intercept('GET', `/api/auth/session`).as('getUser');

    cy.task('clearDatabase');
    cy.task('seedDatabase');
    cy.login('admin@test.com', 'ADMIN');

    // Wait for the intercepted request to complete
    cy.wait('@getUser').then((interception) => {
      cy.wrap(interception?.response?.body?.user.id).as('userId');
    });

    // Visit the dashboard after login
    cy.get('[aria-label^="SpeedDial"]').click();
    cy.getCy('dashboard').click();
  });

  it('displays logged user when searched', () => {
    cy.getCy('filter-button').click();
    cy.getCy('filter-input-Name').type('test user');
    cy.get('tbody>tr>th').contains('Test User');
    cy.get('tbody>tr>th').contains('admin@test.com');
    cy.get('tbody>tr>th').contains('admin');
  });

  describe('when updating role', () => {
    it('displays confim card when another role is selected', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type('test user');
      cy.get('@userId').then((userId) => {
        cy.getCy(`${userId}-role-select`).click();
      });
      cy.get('[data-value="TRAINEE"]').click();
      cy.getCy('small-confirm-card').should('be.visible');
    });

    it('keeps old role if cancel button is pressed', () => {
      cy.getCy('filter-button').click();
      cy.getCy('filter-input-Name').type('test user');
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
      cy.getCy('filter-input-Name').type('test user');
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
});
