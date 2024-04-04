describe('Course editing form', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  it('is not available for trainees', () => {
    cy.login('trainee@example.com', 'TRAINEE');
    cy.contains('Robot Framework Fundamentals').click();
    cy.getCy('editCourseButton').should('not.exist');
  });

  it('allows admin to edit course summary', () => {
    cy.login('john.doe@example.com', 'ADMIN');
    cy.contains('Robot Framework Fundamentals').click();
    cy.getCy('editCourseButton').click();
    cy.getCy('courseFormSummary').type('New summary for Robot');
    cy.getCy('courseFormEdit').click();
    cy.getCy('confirmCard')
      .eq(2)
      .within(() => {
        cy.contains('button', 'Confirm').click();
      });
    cy.contains('New summary for Robot');
  });

  it('allows trainer to edit course name', () => {
    cy.login('emily.davis@example.com', 'TRAINER');
    cy.contains('Robot Framework Fundamentals').click();
    cy.getCy('editCourseButton').click();
    cy.getCy('courseFormName').clear();
    cy.getCy('courseFormName').type('Roborobo Training');
    cy.getCy('courseFormEdit').click();
    cy.getCy('confirmCard')
      .eq(2)
      .within(() => {
        cy.contains('button', 'Confirm').click();
      });
    cy.contains('Roborobo Training');
  });

  it('allows trainer to save new template', () => {
    cy.intercept('GET', `/api/auth/session`).as('getUser');
    cy.login('emily.davis@example.com', 'TRAINER');
    cy.wait('@getUser').then((interception) => {
      cy.wrap(interception?.response?.body?.user.id).as('userId');
    });
    cy.contains('Robot Framework Fundamentals').click();
    cy.getCy('editCourseButton').click();
    cy.getCy('saveTemplateButton').click();
    cy.getCy('confirmCard')
      .eq(1)
      .within(() => {
        cy.contains('button', 'Confirm').click();
      });
    cy.get('@userId').then((userId) => {
      cy.visit(`/profile/${userId}`);
    });
    cy.getCy('myCoursesTab').click();
    cy.getCy('templateListControls').click();
    cy.getCy('templateList').contains('Robot Framework Fundamentals');
  });
});
