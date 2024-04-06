describe('Template editing', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  describe('when logged in as an admin', () => {
    beforeEach(() => {
      cy.login('john.doe@example.com', 'ADMIN');
      cy.visit('/profile/clsiortzr000008k10sundybm');
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
      cy.visit('/profile/clsiom8xf000008k12bgf6bw6'); //emily davis's user id
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
