describe('Course creation', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
  });

  const course = {
    name: 'Kubernetes Fundamentals',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    startDate: '2030-06-01T08:30',
    endDate: '2030-07-01T08:30',
    maxStudents: '100',
  };

  it('course creation should be successful when the input is valid ', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormName').type(course.name);
    cy.getCy('courseFormDescription').type(course.description);
    cy.getCy('courseFormStartDate').type(course.startDate);
    cy.getCy('courseFormEndDate').type(course.endDate);
    cy.getCy('courseFormMaxStudents').clear().type(course.maxStudents);
    cy.getCy('courseFormSubmit').click();
    cy.contains(course.name).click();
    cy.contains(course.description);
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
    cy.wait(1500);
    cy.getCy('courseFormMaxStudents').type('{backspace}{backspace}');
    cy.getCy('courseFormSubmit').click();
    requiredErrors.forEach((error) => cy.contains(error));
  });

  it('should not be possible for end date to be before start date', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormStartDate').type('2030-06-01T08:30');
    cy.getCy('courseFormEndDate').type('2030-05-01T08:30');
    cy.getCy('courseFormSubmit').click();
    cy.contains('The end date cannot be before the start date');
  });

  it('should not be possible for start date to be in the past', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormStartDate').type('2020-06-01T08:30');
    cy.getCy('courseFormSubmit').click();
    cy.contains('Start date cannot be in the past');
  });

  it('should not be possible to access course creation page as a trainee', () => {
    cy.login('trainee@test.com', 'TRAINEE');
    cy.visit('/course/create');
    cy.contains('You are not authorized to view this page');
  });
});
