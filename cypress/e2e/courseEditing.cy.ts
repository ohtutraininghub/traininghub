import { Role } from '@prisma/client';

const traineeUser = {
  name: 'Taylor Trainee',
  email: 'taylor@traininghub.org',
  role: Role.TRAINEE,
};

const trainerUser = {
  name: 'Tim Trainer',
  email: 'tim@traininghub.org',
  role: Role.TRAINER,
};

const adminUser = {
  name: 'Anna Admin',
  email: 'anna@traininghub.org',
  role: Role.ADMIN,
};

describe('Course editing form', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  it('is not available for trainees', () => {
    cy.login(traineeUser.email, traineeUser.role);
    cy.contains('Robot Framework Fundamentals').click();
    cy.getCy('editCourseButton').should('not.exist');
  });

  it('allows admin to edit course summary', () => {
    cy.login(adminUser.email, adminUser.role);
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
    cy.login(trainerUser.email, trainerUser.role);
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
    cy.login(trainerUser.email, trainerUser.role);
    cy.contains('Robot Framework Fundamentals').click();
    cy.getCy('editCourseButton').click();
    cy.getCy('saveTemplateButton').click();
    cy.getCy('confirmCard')
      .eq(1)
      .within(() => {
        cy.contains('button', 'Confirm').click();
      });
    cy.visit('/profile');
    cy.getCy('myCoursesTab').click();
    cy.getCy('templateListControls').click();
    cy.getCy('templateList').contains('Robot Framework Fundamentals');
  });
});
