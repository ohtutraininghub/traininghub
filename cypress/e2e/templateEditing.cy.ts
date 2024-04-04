describe('Template editing', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  describe('when logged in as an admin', () => {
    beforeEach(() => {
      cy.login('john.doe@example.com', 'ADMIN');
      cy.intercept('GET', `/api/auth/session`).as('getUser');
      cy.wait('@getUser').then((interception) => {
        cy.wrap(interception?.response?.body?.user.id).as('userId');
      });
      cy.get('@userId').then((userId) => {
        cy.visit(`/profile/${userId}`);
      });
      cy.getCy('myCoursesTab').click();
      cy.getCy('templateListControls').click();
    });

    it('should allow admin to edit any template', () => {
      cy.getCy('EditTemplateButton').first().click();
      cy.getCy('templateFormName').should('have.value', 'Kubernetes Basics'); // This is the first template in the seeded data and should be Emily Davis's
      cy.getCy('templateFormName').clear();
      cy.getCy('templateFormName').type('Kubernetes Basics for beginners');
      cy.getCy('updateTemplateButton').should('exist').click();
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag').contains('Kubernetes Basics for beginners');
    });

    it('should not edit the template if the form is closed', () => {
      cy.getCy('EditTemplateButton').first().click();
      cy.getCy('templateFormName').should('have.value', 'Kubernetes Basics');
      cy.getCy('templateFormName').clear();
      cy.getCy('templateFormName').type('Kubernetes Basics for beginners');
      cy.getCy('closeButton').click();
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag').contains('Kubernetes Basics');
    });
  });

  describe('when logged in as a trainer', () => {
    beforeEach(() => {
      cy.login('emily.davis@example.com', 'TRAINER');
      cy.intercept('GET', `/api/auth/session`).as('getUser');
      cy.wait('@getUser').then((interception) => {
        cy.wrap(interception?.response?.body?.user.id).as('userId');
      });
      cy.get('@userId').then((userId) => {
        cy.visit(`/profile/${userId}`);
      });
      cy.getCy('myCoursesTab').click();
      cy.getCy('templateListControls').click();
    });

    it('should allow trainer to edit own template', () => {
      cy.getCy('EditTemplateButton').first().click();
      cy.getCy('templateFormName').should('have.value', 'Kubernetes Basics'); // This is the only Emily's template in the seeded data
      cy.getCy('templateFormName').clear();
      cy.getCy('templateFormName').type('Kubernetes Basics for beginners');
      cy.getCy('updateTemplateButton').should('exist').click();
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag').contains('Kubernetes Basics for beginners');
    });
  });
});
