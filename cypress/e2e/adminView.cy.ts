describe('Admin view', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.login('admin@test.com', 'ADMIN');
    cy.get('[aria-label^="SpeedDial"]').click();
    cy.getCy('dashboard').click();
  });

  it('admin dashboard should be accessible', () => {
    cy.get('h1').contains('Admin dashboard');
  });

  it('taglist should be accessible', () => {
    cy.get('h2').contains('Tags');
  });

  it('user list should be accessible', () => {
    cy.get('h2').eq(3).contains('Users');
  });
});

describe('User list', () => {
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
      cy.getCy(`${userId}-role-select`).find('p').should('contain', 'trainee');
    });
  });
});
