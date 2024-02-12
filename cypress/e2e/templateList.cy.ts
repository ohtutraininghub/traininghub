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

    it('should allow admin to delete any template', () => {
      cy.getCy('deleteTemplateButton').first().click();
      cy.get('[data-testid="confirmCardConfirm"]:visible').first().click();
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag').contains('Kubernetes').should('not.exist');
      cy.getCy('deleteTemplateButton').first().click();
      cy.get('[data-testid="confirmCardConfirm"]:visible').first().click();
      cy.getCy('templateList').as('templateListTag');
      // Last template removed so list component is gone
      cy.get('@templateListTag').should('not.exist');
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
