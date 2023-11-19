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
});
