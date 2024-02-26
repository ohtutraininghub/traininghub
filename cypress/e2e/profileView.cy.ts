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

const currentDate = new Date().setHours(9, 0, 0, 0).valueOf();
const msDay = 24 * 60 * 60 * 1000;
const msHour = 60 * 60 * 1000;

const testCourses = [
  {
    name: 'Git Fundamentals',
    startDate: new Date(currentDate - 7 * msDay), // course is in the past
    endDate: new Date(currentDate - 7 * msDay + 8 * msHour),
  },
  {
    name: 'Jenkins Fundamentals',
    startDate: new Date(currentDate - 2 * msDay), // course is inprogress
    endDate: new Date(currentDate + 1 * msDay + 7.5 * msHour),
  },
  {
    name: 'Robot Framework Fundamentals',
    startDate: new Date(currentDate + 180 * msDay), // course is in the future
    endDate: new Date(currentDate + 183 * msDay + 6.5 * msHour),
  },
  {
    name: 'Kubernetes Fundamentals',
    startDate: new Date(currentDate + 365 * msDay), // course is in the future
    endDate: new Date(currentDate + 366 * msDay + 7 * msHour),
  },
];

const templateData = [
  {
    name: 'Kubernetes Basics',
    createdBy: 'Emily Davis',
    createdById: 'clsiom8xf000008k12bgf6bw6',
  },
  {
    name: 'Robot Framework Basics',
    createdBy: 'John Doe',
    createdById: 'clsiortzr000008k10sundybm',
  },
];

describe('Profile View', () => {
  before(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
  });

  describe('when logged in as a trainee', () => {
    beforeEach(() => {
      cy.login(traineeUser.email, traineeUser.role);
      cy.visit('/profile');
      // close automatically opened dropdown
      cy.getCy('listControls\\.upcomingCourses').click();
    });
    it('should display the username and email', () => {
      cy.contains('Taylor Trainee');
      cy.contains('taylor@traininghub.org');
    });
    it('should not show admin dashboard for trainee', () => {
      cy.contains('Admin dashboard').should('not.exist');
    });
    it('should show correct courses in dropdowns', () => {
      cy.contains(testCourses[1].name);

      cy.getCy('listControls\\.upcomingCourses').click();
      cy.contains(testCourses[2].name);
      cy.contains(testCourses[3].name);

      cy.getCy('listControls\\.upcomingCourses').click();
      cy.getCy('listControls\\.inprogressCourses').click();

      cy.getCy('listControls\\.endedCourses').click();
      cy.contains(testCourses[0].name);
    });
    it('should not show upcoming created courses for trainee', () => {
      cy.contains('Upcoming created courses').should('not.exist');
    });
    it('should not show template list for trainee', () => {
      cy.contains('My course templates').should('not.exist');
    });
  });
  describe('when logged in as a trainer', () => {
    beforeEach(() => {
      cy.login(trainerUser.email, trainerUser.role);
      cy.visit('/profile');
      // close automatically opened dropdowns
      cy.getCy('listControls\\.inprogressCourses').click();
      cy.getCy('listControls\\.upcomingCourses').click();
      cy.getCy('listControls\\.endedCreated').click();
    });
    it('should not show admin dashboard for trainer', () => {
      cy.contains('Admin dashboard').should('not.exist');
    });
    it('should show upcoming created courses for trainer', () => {
      // trainer user is the creator of 2 upcoming courses
      cy.contains('Upcoming created courses (2)');
      cy.contains(testCourses[0].name).should('not.exist');
      cy.contains(testCourses[1].name).should('not.exist');
      cy.contains(testCourses[2].name);
      cy.contains(testCourses[3].name);
    });
    it('should not show any enrolled courses for trainer', () => {
      // open and close one by one because they each contain the same text
      cy.getCy('listControls\\.inprogressCourses').click();
      cy.contains('No courses to show.');
      cy.getCy('listControls\\.inprogressCourses').click();

      cy.getCy('listControls\\.upcomingCourses').click();
      cy.contains('No courses to show.');
      cy.getCy('listControls\\.upcomingCourses').click();

      cy.getCy('listControls\\.endedCourses').click();
      cy.contains('No courses to show.');
    });
    it('should show template list for trainer', () => {
      // trainer user doesn't have any templates
      cy.contains('My course templates (0)');
    });
  });
  describe('when logged in as an admin', () => {
    beforeEach(() => {
      cy.login(adminUser.email, adminUser.role);
      cy.visit('/profile');
      // close automatically opened dropdowns
      cy.getCy('listControls\\.inprogressCourses').click();
      cy.getCy('listControls\\.upcomingCourses').click();
    });
    it('should show admin dashboard for admin', () => {
      cy.contains('Admin dashboard');
    });
    it('should not show upcoming created courses for admin', () => {
      // admin isn't the creator of any courses
      cy.contains('Upcoming created courses (0)');
      cy.contains('No courses to show.');
    });
    it('should show all templates for admin', () => {
      cy.contains('All course templates (2)');

      // open template dropdown
      cy.getCy('templateListControls').click();
      cy.contains(templateData[0].name);
      cy.contains(templateData[1].name);
      cy.contains(templateData[0].createdBy);
      cy.contains(templateData[1].createdBy);
    });
  });
});
