describe('Course creation', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.intercept('*_next/image?url=http*', (req) => {
      req.reply({ statusCode: 200, fixture: 'images/test_logo.png' });
    });
  });

  const updatedCourse = {
    name: 'Kubernetes 2',
    description: 'New description',
    maxStudents: '120',
    image: '',
    summary: 'All you ever wanted to know about kubernetes!',
  };

  it('editing course with valid data should be successful', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.contains('Kubernetes Fundamentals').click();
    cy.getCy('EditIcon').click();

    cy.getCy('courseFormName').type(
      `{selectall}{backspace}${updatedCourse.name}`
    );
    cy.get('.ProseMirror').type(
      `{selectall}{backspace}${updatedCourse.description}`
    );

    cy.getCy('courseFormSummary').type(updatedCourse.summary);
    cy.getCy('courseFormMaxStudents').type(
      `{selectall}{backspace}${updatedCourse.maxStudents}`
    );
    cy.getCy('courseFormImage').type('http://test-image.com');
    cy.getCy('courseFormSubmit').click();

    cy.contains(updatedCourse.summary);
    cy.contains(updatedCourse.name).click();
    cy.contains(updatedCourse.name);
    cy.contains(updatedCourse.maxStudents);
    cy.contains(updatedCourse.description);
    cy.getCy('courseImage').should('be.visible');
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

  it('should not be possible to add an invalid url for course image', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormImage').type('invalid url');
    cy.getCy('courseFormSubmit').click();
    cy.contains('Invalid url');
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
