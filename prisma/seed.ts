import { Role, User } from '@prisma/client';
import { clearDatabase, prisma } from '../src/lib/prisma';

const traineeUser = {
  name: 'Taylor Trainee',
  email: 'taylor@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINEE,
};

const trainerUser = {
  name: 'Tim Trainer',
  email: 'tim@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINER,
};

const currentDate = new Date().setHours(9, 0, 0, 0).valueOf();
const msDay = 24 * 60 * 60 * 1000;
const msHour = 60 * 60 * 1000;

const courseData = [
  {
    name: 'Git Fundamentals',
    description:
      'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
    startDate: new Date(currentDate + 7 * msDay),
    endDate: new Date(currentDate + 7 * msDay + 8 * msHour),
    maxStudents: 12,
    tags: ['Git'],
  },
  {
    name: 'Jenkins Fundamentals',
    description:
      'Learn how to automate building, testing and deploying your code using Jenkins, a popular open-source server for setting up continuous integration and continuous delivery pipelines. During this two-day course you will get a lot of hands-on experience in Jenkins basics like setting up a Jenkins server, choosing and installing Jenkins plugins and building a Jenkins CI/CD pipeline.',
    startDate: new Date(currentDate + 30 * msDay),
    endDate: new Date(currentDate + 32 * msDay + 7.5 * msHour),
    maxStudents: 8,
    tags: ['CI/CD', 'Jenkins'],
  },
  {
    name: 'Robot Framework Fundamentals',
    description:
      'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
    startDate: new Date(currentDate + 180 * msDay),
    endDate: new Date(currentDate + 183 * msDay + 6.5 * msHour),
    maxStudents: 10,
    tags: ['Testing', 'Python', 'Robot Framework'],
  },
  {
    name: 'Kubernetes Fundamentals',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    startDate: new Date(currentDate + 365 * msDay),
    endDate: new Date(currentDate + 366 * msDay + 7 * msHour),
    maxStudents: 15,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
  },
];

const templateData = [
  {
    name: 'Kubernetes',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    maxStudents: 15,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
  },
  {
    name: 'Robot Framework Fundamentals',
    description:
      'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
    maxStudents: 10,
    tags: ['Testing', 'Python', 'Robot Framework'],
  },
];

const tagData = [
  { name: 'Agile methods' },
  { name: 'CI/CD' },
  { name: 'Docker' },
  { name: 'Git' },
  { name: 'Jenkins' },
  { name: 'Kubernetes' },
  { name: 'Python' },
  { name: 'Robot Framework' },
  { name: 'Testing' },
];

const userData: User[] = [
  {
    id: '123001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    emailVerified: null,
    image: 'https://example.com/johndoe.jpg',
    role: 'ADMIN',
  },
  {
    id: '123002',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    emailVerified: null,
    image: 'https://example.com/alicesmith.jpg',
    role: 'ADMIN',
  },
  {
    id: '123003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    emailVerified: null,
    image: 'https://example.com/bobjohnson.jpg',
    role: 'TRAINEE',
  },
  {
    id: '123004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    emailVerified: null,
    image: 'https://example.com/emilydavis.jpg',
    role: 'TRAINER',
  },
  {
    id: '123005',
    name: 'Chris Miller',
    email: 'chris.miller@example.com',
    emailVerified: null,
    image: 'https://example.com/chrismiller.jpg',
    role: 'ADMIN',
  },
  {
    id: '123006',
    name: 'Sophia White',
    email: 'sophia.white@example.com',
    emailVerified: null,
    image: 'https://example.com/sophiawhite.jpg',
    role: 'TRAINER',
  },
  {
    id: '123007',
    name: 'Daniel Brown',
    email: 'daniel.brown@example.com',
    emailVerified: null,
    image: 'https://example.com/danielbrown.jpg',
    role: 'ADMIN',
  },
  {
    id: '123008',
    name: 'Olivia Taylor',
    email: 'olivia.taylor@example.com',
    emailVerified: null,
    image: 'https://example.com/oliviataylor.jpg',
    role: 'TRAINER',
  },
  {
    id: '123009',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    emailVerified: null,
    image: 'https://example.com/michaelwilson.jpg',
    role: 'TRAINER',
  },
  {
    id: '123010',
    name: 'Ella Moore',
    email: 'ella.moore@example.com',
    emailVerified: null,
    image: 'https://example.com/ellamoore.jpg',
    role: 'TRAINEE',
  },
];

export async function seedUsers() {
  await prisma.user.createMany({ data: userData });
}

export async function main() {
  await clearDatabase();

  const user = await prisma.user.create({ data: {} });
  const trainee = await prisma.user.create({ data: traineeUser });
  const trainer = await prisma.user.create({ data: trainerUser });

  await prisma.tag.createMany({
    data: tagData,
  });

  await Promise.all(
    courseData.map(async (course) => {
      await prisma.course.create({
        data: {
          name: course.name,
          description: course.description,
          startDate: course.startDate,
          endDate: course.endDate,
          maxStudents: course.maxStudents,
          createdById: user.id,
          students: {
            connect: {
              id: trainee.id,
            },
          },
          tags: {
            connect: course.tags.map((tag) => ({ name: tag })),
          },
        },
      });
    })
  );

  await Promise.all(
    templateData.map(async (template) => {
      await prisma.template.create({
        data: {
          name: template.name,
          description: template.description,
          maxStudents: template.maxStudents,
          createdById: trainer.id,
          tags: {
            connect: template.tags.map((tag) => ({ name: tag })),
          },
        },
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
