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
    cy.get('h2').eq(1).contains('Users');
  });
});

describe('User list', () => {
  let userId: string;

  beforeEach(() => {
    cy.task('clearDatabase');
    cy.login('admin@test.com', 'ADMIN');

    // Intercepting the session request to get the user ID
    cy.intercept('GET', 'http://localhost:3000/api/auth/session').as('getUser');

    // Wait for the intercepted request to complete
    cy.wait('@getUser').then((interception) => {
      userId = interception.response.body.user.id;
    });

    // Use cy.wrap to ensure the userId is correctly resolved
    cy.wrap(userId).as('userId');

    // Visit the dashboard after login
    cy.get('[aria-label^="SpeedDial"]').click();
    cy.getCy('dashboard').click();
  });

  it('displays logged user', () => {
    cy.get('tbody>tr>th').contains('Test User');
    cy.get('tbody>tr>th').contains('admin@test.com');
    cy.get('tbody>tr>th').contains('admin');
  });

  it('displays confim card when another role is selected', () => {
    cy.getCy(`${userId}-role-select`).click();
    cy.get('[data-value="TRAINEE"]').click();
    cy.getCy('small-confirm-card').should('be.visible');
  });

  it('keeps old role if cancel button is pressed', () => {
    cy.getCy(`${userId}-role-select`).click();
    cy.get('[data-value="TRAINEE"]').click();
    cy.getCy('cancel-button').click();
    cy.getCy('small-confirm-card').should('not.exist');
    cy.getCy(`${userId}-role-select`).find('p').should('contain', 'admin');
  });
  it.only('updates role when confirm button is pressed', () => {
    cy.getCy(`${userId}-role-select`).click();
    cy.get('[data-value="TRAINEE"]').click();
    cy.getCy('confirm-button').click();
    cy.getCy('small-confirm-card').should('not.exist');
    cy.getCy(`${userId}-role-select`).find('p').should('contain', 'trainee');
  });
});
