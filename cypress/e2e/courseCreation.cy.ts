describe('Course creation', () => {
  before(() => {
    cy.task('clearDatabase');
  });

  const course = {
    name: 'Kubernetes Fundamentals',
    header: 'Learn Kubernetes',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    startDate: '06-01-2030-T08:30PM',
    endDate: '07-01-2030-T08:30PM',
    maxStudents: '100',
  };

  it('course creation should be successful when the input is valid ', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');

    cy.getCy('courseFormName').type(course.name);
    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorHeader1').click();
    cy.get('.ProseMirror').type(`${course.header}{enter}`);

    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorParagraph').click();
    cy.get('.ProseMirror').type(course.description);

    cy.getCy('courseFormStartDate').type(course.startDate);
    cy.getCy('courseFormEndDate').type(course.endDate);
    cy.getCy('courseFormMaxStudents').clear().type(course.maxStudents);
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
    startDate: '06-01-2032-T08:30PM',
    endDate: '07-01-2032-T08:30PM',
    maxStudents: '120',
  };

  it('editing course with valid data should be successful', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.contains(course.name).click();
    cy.getCy('EditIcon').click();

    cy.getCy('courseFormName').clear().type(updatedCourse.name);
    cy.get('.ProseMirror').clear().type(updatedCourse.description);
    cy.getCy('courseFormStartDate').type(updatedCourse.startDate);
    cy.getCy('courseFormEndDate').type(updatedCourse.endDate);
    cy.getCy('courseFormMaxStudents').clear().type(updatedCourse.maxStudents);
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
    cy.getCy('courseFormStartDate').type('06-01-2030-T08:30PM');
    cy.getCy('courseFormEndDate').type('05-01-2030-T08:30PM');
    cy.getCy('courseFormSubmit').click();
    cy.contains('The end date cannot be before the start date');
  });

  it('should not be possible for start date to be in the past', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormStartDate').type('06-01-2020-T08:30PM');
    cy.getCy('courseFormSubmit').click();
    cy.contains('Start date cannot be in the past');
  });

  it('should not be possible for last enroll date to be after the end date', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormEndDate').type('06-01-2050-T01:00AM');
    cy.getCy('courseFormLastEnrollDate').type('06-02-2050-T01:00AM');
    cy.getCy('courseFormSubmit').click();
    cy.contains(
      'The last date to enroll cannot be after the end date of the course'
    );
  });

  it('should not be possible for last cancel date to be after the end date', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormEndDate').type('06-01-2050-T01:00AM');
    cy.getCy('courseFormLastCancelDate').type('06-02-2050-T01:00AM');
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
});
