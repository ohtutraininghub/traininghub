describe('Course creation', () => {
  before(() => {
    cy.task('clearDatabase');
  });

  const course = {
    name: 'Kubernetes Fundamentals',
    header: 'Learn Kubernetes',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    maxStudents: '100',
  };

  it('course creation should be successful when the input is valid ', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');

    cy.getCy('courseFormName').type(course.name);
    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorHeader1').click();
    cy.get('.ProseMirror').type(`${course.header}`);

    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorParagraph').click();
    cy.get('.ProseMirror').type(course.description);

    cy.formatDate('courseFormStartDate', -1);
    cy.formatDate('courseFormEndDate', -2);

    cy.getCy('courseFormMaxStudents').type(
      `{selectall}{backspace}${course.maxStudents}`
    );
    cy.getCy('courseFormSubmit').click();
    cy.contains(course.name).click();
    cy.contains(course.name);
    cy.contains(course.header);
    cy.contains(course.maxStudents);
    cy.contains(course.description);
  });

  const updatedCourse = {
    name: 'Kubernetes 2',
    description: 'New description',
    maxStudents: '120',
  };

  it('editing course with valid data should be successful', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.contains(course.name).click();
    cy.getCy('EditIcon').click();

    cy.getCy('courseFormName').type(
      `{selectall}{backspace}${updatedCourse.name}`
    );
    cy.get('.ProseMirror').type(
      `{selectall}{backspace}${updatedCourse.description}`
    );
    cy.formatDate('courseFormStartDate', -2);
    cy.formatDate('courseFormEndDate', -3);
    cy.getCy('courseFormMaxStudents').type(
      `{selectall}{backspace}${updatedCourse.maxStudents}`
    );
    cy.getCy('courseFormSubmit').click();

    cy.contains(updatedCourse.name).click();
    cy.contains(updatedCourse.name);
    cy.contains(updatedCourse.maxStudents);
    cy.contains(updatedCourse.description);
  });

  const requiredErrors = [
    'Name is required',
    'Description is required',
    'Start date is required',
    'End date is required',
    'Max students is required',
  ];

  it('required errors should be displayed correctly', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormMaxStudents')
      .should('not.have.value', '')
      .type('{backspace}{backspace}');
    cy.getCy('courseFormSubmit').click();
    requiredErrors.forEach((error) => cy.contains(error));
  });

  it('should not be possible for end date to be before start date', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.formatDate('courseFormStartDate', -2);
    cy.formatDate('courseFormEndDate', -1);
    cy.getCy('courseFormSubmit').click();
    cy.contains('The end date cannot be before the start date');
  });

  it('should not be possible for start date to be in the past', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.formatDate('courseFormStartDate', 3);
    cy.getCy('courseFormSubmit').click();
    cy.contains('Start date cannot be in the past');
  });

  it('should not be possible for last enroll date to be after the end date', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.formatDate('courseFormEndDate', -1);
    cy.formatDate('courseFormLastEnrollDate', -2);
    cy.getCy('courseFormSubmit').click();
    cy.contains(
      'The last date to enroll cannot be after the end date of the course'
    );
  });

  it('should not be possible for last cancel date to be after the end date', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.formatDate('courseFormEndDate', -1);
    cy.formatDate('courseFormLastCancelDate', -2);
    cy.getCy('courseFormSubmit').click();
    cy.contains(
      'The last date to cancel enrollment cannot be after the end date of the course'
    );
  });

  it('should not be possible to access course creation page as a trainee', () => {
    cy.login('trainee@test.com', 'TRAINEE');
    cy.visit('/course/create');
    cy.contains('You are not authorized to view this page');
  });

  it('should be able to open a tooltip', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('tooltipCourseDescription').trigger('mouseover');
    cy.contains(
      'The course description is visible to all users upon opening the course details page.'
    );
  });
});
