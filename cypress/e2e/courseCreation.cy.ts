const course = {
  name: 'Kubernetes Fundamentals',
  header: 'Learn Kubernetes',
  description:
    'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
  startDate: '2030-06-01T08:30',
  endDate: '2030-07-01T08:30',
  maxStudents: '100',
  image: 'http://test-image.com',
};

const template = [
  {
    name: 'Kubernetes Basics',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    summary: 'Learn the basics of Kubernetes',
    maxStudents: 15,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
    createdById: '123002',
  },
  {
    name: 'Robot Framework Basics',
    description:
      'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
    summary: 'Learn the basics of Robot Framework',
    maxStudents: 10,
    tags: ['Testing', 'Python', 'Robot Framework'],
    createdById: '123001',
  },
];

describe('Course creation using template', () => {
  before(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.intercept('*_next/image?url=http*', (req) => {
      req.reply({ statusCode: 200, fixture: 'images/test_logo.png' });
    });
  });

  it('created templates should be visible in the template select', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');

    cy.get('#templateSelect').parent().type('{downarrow}');
    cy.contains(template[0].name);
    cy.contains(template[1].name);
  });

  it('course creation should be successful when tempalte and dates are set', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');

    cy.get('#templateSelect').parent().type('{downarrow}{enter}');

    cy.getCy('courseFormStartDate').type(course.startDate);
    cy.getCy('courseFormEndDate').type(course.endDate);

    cy.getCy('courseFormSubmit').click();
    cy.contains(template[0].summary);
    cy.contains(template[0].name).click();
    cy.contains(template[0].name);
    cy.contains(template[0].maxStudents);
    cy.contains(template[0].description);
    template[0].tags.forEach((tag) => cy.contains(tag));
  });
});

describe('Course creation', () => {
  before(() => {
    cy.task('clearDatabase');
  });

  beforeEach(() => {
    cy.intercept('*_next/image?url=http*', (req) => {
      req.reply({ statusCode: 200, fixture: 'images/test_logo.png' });
    });
  });

  it('course creation should be successful when the input is valid ', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');

    cy.getCy('courseFormName').type(course.name);
    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorHeader1').click();
    cy.get('.ProseMirror').type(`${course.header}{enter}`, { delay: 0 });

    cy.getCy('textEditorTextSelect').click();
    cy.getCy('textSelectorParagraph').click();
    cy.get('.ProseMirror').type(course.description, { delay: 0 });

    cy.getCy('courseFormStartDate').type(course.startDate);
    cy.getCy('courseFormEndDate').type(course.endDate);
    cy.getCy('courseFormMaxStudents').type(
      `{selectall}{backspace}${course.maxStudents}`
    );
    cy.getCy('courseFormImage').type(course.image);
    cy.getCy('courseFormSubmit').click();
    cy.contains(course.name).click();
    cy.contains(course.name);
    cy.contains(course.header);
    cy.contains(course.maxStudents);
    cy.contains(course.description);
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

  it('should not be possible for last enroll date to be after the end date', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormEndDate').type('2050-06-01T00:00');
    cy.getCy('courseFormLastEnrollDate').type('2050-06-02T00:00');
    cy.getCy('courseFormSubmit').click();
    cy.contains(
      'The last date to enroll cannot be after the end date of the course'
    );
  });

  it('should not be possible for last cancel date to be after the end date', () => {
    cy.login('trainer@test.com', 'TRAINER');
    cy.visit('/course/create');
    cy.getCy('courseFormEndDate').type('2050-06-01T00:00');
    cy.getCy('courseFormLastCancelDate').type('2050-06-02T00:00');
    cy.getCy('courseFormSubmit').click();
    cy.contains(
      'The last date to cancel enrollment cannot be after the end date of the course'
    );
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
