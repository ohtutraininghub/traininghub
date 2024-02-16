describe('Template editing', () => {
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

    it('should allow admin to edit any template', () => {
      cy.getCy('EditTemplateButton').first().click();
      cy.getCy('templateFormName').contains('Kubernetes Basics'); // This is the first template in the seeded data and should be Emily Davis's
      cy.getCy('templateFormName').clear();
      cy.getCy('templateFormName').type('Kubernetes Basics for beginners');
      cy.getCy('updateTemplateButton').click();
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag').contains('Kubernetes Basics for beginners');
    });
  });

  describe('when logged in as a trainer', () => {
    beforeEach(() => {
      cy.login('emily.davis@example.com', 'TRAINER');
      cy.getCy('avatarIconButton').click();
      cy.getCy('viewProfileMenuItem').click();
      cy.getCy('templateListControls').click();
    });

    it('should only show edit buttons for own templates', () => {
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag')
        .find('li')
        .each(($li) => {
          const createdBy = $li.find('.secondary').text();

          if (createdBy === 'Emily Davis') {
            expect($li.find('.EditTemplateButton')).to.exist;
          } else {
            expect($li.find('.EditTemplateButton')).to.not.exist;
          }
        });
    });

    it('should allow trainer to edit own template', () => {
      cy.getCy('EditTemplateButton').first().click();
      cy.getCy('templateFormName').contains('Kubernetes Basics');
      cy.getCy('templateFormName').clear();
      cy.getCy('templateFormName').type('Kubernetes Basics for beginners');
      cy.getCy('updateTemplateButton').click();
      cy.getCy('templateList').as('templateListTag');
      cy.get('@templateListTag').contains('Kubernetes Basics for beginners');
    });
  });
});
