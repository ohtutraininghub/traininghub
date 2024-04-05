import { Role } from '@prisma/client';

describe('BackToTopToggle button', () => {
  const course = {
    name: 'Kubernetes Fundamentals part 2',
    header: 'Learn Kubernetes',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    startDate: '2030-06-01T08:30',
    endDate: '2030-07-01T08:30',
    maxStudents: '100',
  };
  const trainerUser = {
    name: 'Tim Trainer',
    email: 'tim@traininghub.org',
    role: Role.TRAINER,
  };
  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('does not initially show backToTopToggle component', () => {
    cy.login(trainerUser.email, 'TRAINER');
    cy.getCy('backToTopToggle').should('not.be.visible');
  });

  it('shows the button after scrolling down and scrolls back to top when clicked', () => {
    cy.login(trainerUser.email, 'TRAINER');
    cy.visit('/course/create');
    // create new course to fill course view further and enable scrolling down
    cy.getCy('courseFormName').type(course.name);
    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorHeader1').click();
    cy.get('.ProseMirror').type(`${course.header}{enter}`);

    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorParagraph').click();
    cy.get('.ProseMirror').type(course.description);

    cy.getCy('courseFormStartDate').type(course.startDate);
    cy.getCy('courseFormEndDate').type(course.endDate);
    cy.getCy('courseFormMaxStudents').clear();
    cy.getCy('courseFormMaxStudents').type(course.maxStudents);
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
