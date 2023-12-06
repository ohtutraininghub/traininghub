describe('BackToTopToggle button', () => {
  const course = {
    name: 'Kubernetes Fundamentals part 2',
    header: 'Learn Kubernetes',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    maxStudents: '100',
  };

  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('does not initially show backToTopToggle component', () => {
    cy.login('testuser@test.com', 'TRAINER');
    cy.getCy('backToTopToggle').should('not.be.visible');
  });

  it('shows the button after scrolling down and scrolls back to top when clicked', () => {
    cy.login('testuser@test.com', 'TRAINER');
    cy.visit('/course/create');
    // create new course to fill course view further and enable scrolling down
    cy.getCy('courseFormName').type(course.name);
    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorHeader1').click();
    cy.get('.ProseMirror').type(`${course.header}{enter}`);

    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorParagraph').click();
    cy.get('.ProseMirror').type(course.description);
    cy.formatDate('courseFormStartDate', -1);
    cy.formatDate('courseFormEndDate', -2);
    cy.getCy('courseFormMaxStudents').clear().type(course.maxStudents);
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
