describe('Template list', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  describe('when logged in as an admin', () => {
    beforeEach(() => {
      cy.login('john.doe@example.com', 'ADMIN');
      cy.getCy('avatarIconButton').click();
      cy.getCy('viewProfileMenuItem').click();
      cy.getCy('templateListControls').click();
    });

    it("should display all users' templates", () => {
      cy.getCy('templateListHeader').contains('All course templates');
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag').contains('Kubernetes');
      cy.get('@templateListTag').contains('Emily Davis');
      cy.get('@templateListTag').contains('Robot');
      cy.get('@templateListTag').contains('John Doe');
    });
  });

  describe('when logged in as a trainer', () => {
    beforeEach(() => {
      cy.login('emily.davis@example.com', 'TRAINER');
      cy.getCy('avatarIconButton').click();
      cy.getCy('viewProfileMenuItem').click();
      cy.getCy('templateListControls').click();
    });

    it('should display only own templates', () => {
      cy.getCy('templateListHeader').contains('My course templates');
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag').contains('Kubernetes');
      cy.get('@templateListTag').contains('Emily Davis');
      cy.get('@templateListTag').contains('Robot').should('not.exist');
      cy.get('@templateListTag').contains('John Doe').should('not.exist');
    });
  });
});
