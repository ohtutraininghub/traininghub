describe('BackToTopToggle button', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('does not initially show backToTopToggle component', () => {
    cy.login('testuser@test.com', 'TRAINER');
    cy.getCy('backToTopToggle').should('not.be.visible');
  });

  it('shows the button after scrolling down and scrolls back to top when clicked', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.contains('Kubernetes Fundamentals').click();
    cy.getCy('EditIcon').click();
    cy.getCy('courseFormSubmit').click();
    // view at top, button should not be visible
    cy.getCy('backToTopToggle').should('not.be.visible');
    // scroll to bottom to make toggle visible
    cy.scrollTo('bottom');
    cy.getCy('backToTopToggle').should('be.visible');
    // scrolls to top by clicking button
    cy.getCy('backToTopToggle').click();
    cy.window().its('scrollY').should('eq', 0);
    // view at top again, button should not be visible
    cy.getCy('backToTopToggle').should('not.be.visible');
  });
});
