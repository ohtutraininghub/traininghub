import { Role, User } from '@prisma/client';
import { clearDatabase, prisma } from '../src/lib/prisma';

const traineeUser = {
  id: 'cluo340vw000108jyfdxm12jm',
  name: 'Taylor Trainee',
  email: 'taylor@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINEE,
  countryId: 'clum4qgfw000008k095npgxsx',
  titleId: 'clum4qgfw000008k095npgxwe',
  profileCompleted: true,
};

const trainerUser = {
  id: 'cluo35ozy000208jy18sdfe4a',
  name: 'Tim Trainer',
  email: 'tim@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINER,
  countryId: 'clum4qgfw000008k095npgxsx',
  titleId: 'clum4qgfw000008k095npgasd',
  profileCompleted: true,
};

const adminUser = {
  id: 'cluo36844000308jy411a7nub',
  name: 'Anna Admin',
  email: 'anna@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.ADMIN,
  countryId: 'clum4qgfw000008k095npgxsx',
  titleId: 'clum4qgfw000008k095npgasd',
  profileCompleted: true,
};

const currentDate = new Date().setHours(9, 0, 0, 0).valueOf();
const msDay = 24 * 60 * 60 * 1000;
const msHour = 60 * 60 * 1000;

const courseData = [
  {
    name: 'Git Fundamentals',
    description:
      'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
    startDate: new Date(currentDate - 7 * msDay), // course is in the past
    endDate: new Date(currentDate - 7 * msDay + 8 * msHour),
    maxStudents: 12,
    tags: ['Git'],
  },
  {
    name: 'Docker Fundamentals',
    description:
      'This course will introduce you to the basics of Docker, a popular platform for developing, shipping and running applications. You will learn how to create and run containers, and how to build and manage images. The course will also cover topics like networking and storage, and how to work with Docker Compose.',
    startDate: new Date(currentDate - 6 * msDay), // course is in the past
    endDate: new Date(currentDate - 6 * msDay + 7 * msHour),
    maxStudents: 10,
    tags: ['Docker', 'CI/CD'],
  },
  {
    name: 'Jenkins Fundamentals',
    description:
      'Learn how to automate building, testing and deploying your code using Jenkins, a popular open-source server for setting up continuous integration and continuous delivery pipelines. During this two-day course you will get a lot of hands-on experience in Jenkins basics like setting up a Jenkins server, choosing and installing Jenkins plugins and building a Jenkins CI/CD pipeline.',
    startDate: new Date(currentDate - 2 * msDay), // course is inprogress
    endDate: new Date(currentDate + 1 * msDay + 7.5 * msHour),
    maxStudents: 8,
    tags: ['CI/CD', 'Jenkins'],
  },
  {
    name: 'Robot Framework Fundamentals',
    description:
      'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
    startDate: new Date(currentDate + 180 * msDay), // course is in the future
    endDate: new Date(currentDate + 183 * msDay + 6.5 * msHour),
    maxStudents: 10,
    tags: ['Testing', 'Python', 'Robot Framework'],
  },
  {
    name: 'Kubernetes Fundamentals',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    startDate: new Date(currentDate + 365 * msDay), // course is in the future
    endDate: new Date(currentDate + 366 * msDay + 7 * msHour),
    maxStudents: 15,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
  },
];

const templateData = [
  {
    name: 'Kubernetes Basics',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    summary: 'Learn the basics of Kubernetes',
    maxStudents: 15,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
    createdById: 'clsiom8xf000008k12bgf6bw6', // Emily Davis
  },
  {
    name: 'Robot Framework Basics',
    description:
      'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
    summary: 'Learn the basics of Robot Framework',
    maxStudents: 10,
    tags: ['Testing', 'Python', 'Robot Framework'],
    createdById: 'clsiortzr000008k10sundybm', // John Doe
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

const countryData = [
  { id: 'clum4qgfw000008k095npgxsx', name: 'Finland', countryCode: 'FI' },
  { name: 'Sweden', countryCode: 'SE' },
  { name: 'Norway', countryCode: 'NO' },
  { name: 'Denmark', countryCode: 'DK' },
  { id: 'clumicdtg0003fyakdum2yzdv', name: 'Germany', countryCode: 'DE' },
  { name: 'Netherlands', countryCode: 'NL' },
  { name: 'Switzerland', countryCode: 'CH' },
  { name: 'United Kingdom', countryCode: 'GB' },
  { name: 'United States', countryCode: 'US' },
  { name: 'Poland', countryCode: 'PL' },
];

const titleData = [
  { id: 'clum4qgfw000008k095npgxwe', name: 'Employee' },
  { id: 'clum4qgfw000008k095npgasd', name: 'Management' },
  { name: 'Team Lead' },
];

const userData: User[] = [
  {
    id: 'clsiortzr000008k10sundybm',
    name: 'John Doe',
    email: 'john.doe@example.com',
    emailVerified: null,
    image: 'https://example.com/johndoe.jpg',
    role: 'ADMIN',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgasd',
    profileCompleted: true,
  },
  {
    id: '123002',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    emailVerified: null,
    image: 'https://example.com/alicesmith.jpg',
    role: 'ADMIN',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgasd',
    profileCompleted: true,
  },
  {
    id: '123003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    emailVerified: null,
    image: 'https://example.com/bobjohnson.jpg',
    role: 'TRAINEE',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgxwe',
    profileCompleted: true,
  },
  {
    id: 'clsiom8xf000008k12bgf6bw6',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    emailVerified: null,
    image: 'https://example.com/emilydavis.jpg',
    role: 'TRAINER',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgxwe',
    profileCompleted: true,
  },
  {
    id: '123005',
    name: 'Chris Miller',
    email: 'chris.miller@example.com',
    emailVerified: null,
    image: 'https://example.com/chrismiller.jpg',
    role: 'ADMIN',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgxwe',
    profileCompleted: true,
  },
  {
    id: '123006',
    name: 'Sophia White',
    email: 'sophia.white@example.com',
    emailVerified: null,
    image: 'https://example.com/sophiawhite.jpg',
    role: 'TRAINER',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgxwe',
    profileCompleted: true,
  },
  {
    id: '123007',
    name: 'Daniel Brown',
    email: 'daniel.brown@example.com',
    emailVerified: null,
    image: 'https://example.com/danielbrown.jpg',
    role: 'ADMIN',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgxwe',
    profileCompleted: true,
  },
  {
    id: '123008',
    name: 'Olivia Taylor',
    email: 'olivia.taylor@example.com',
    emailVerified: null,
    image: 'https://example.com/oliviataylor.jpg',
    role: 'TRAINER',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgxwe',
    profileCompleted: true,
  },
  {
    id: '123009',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    emailVerified: null,
    image: 'https://example.com/michaelwilson.jpg',
    role: 'TRAINER',
    countryId: 'clum4qgfw000008k095npgxsx',
    titleId: 'clum4qgfw000008k095npgxwe',
    profileCompleted: true,
  },
  {
    id: '123010',
    name: 'Ella Moore',
    email: 'ella.moore@example.com',
    emailVerified: null,
    image: 'https://example.com/ellamoore.jpg',
    role: 'TRAINEE',
    countryId: null,
    titleId: null,
    profileCompleted: false,
  },
];

export async function seedUsers() {
  await prisma.user.createMany({ data: userData });
}

export async function main() {
  await clearDatabase();
  await prisma.country.createMany({
    data: countryData,
  });

  await prisma.title.createMany({
    data: titleData,
  });

  await prisma.user.create({ data: {} });
  const trainee = await prisma.user.create({ data: traineeUser });
  const trainer = await prisma.user.create({ data: trainerUser });
  await prisma.user.create({ data: adminUser });

  await seedUsers();

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
          createdById: trainer.id,
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
          summary: template.summary,
          createdById: template.createdById,
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
