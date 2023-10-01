import { prisma } from '../src/lib/prisma';

const courseData = [
  {
    name: 'Git Fundamentals',
    description:
      'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
    startDate: '2023-10-02T09:30:00.000Z',
    endDate: '2023-10-02T16:30:00.000Z',
    maxStudents: 12,
  },
  {
    name: 'Jenkins Fundamentals',
    description:
      'Learn how to automate building, testing and deploying your code using Jenkins, a popular open-source server for setting up continuous integration and continous delivery pipelines. During this two-day course you will get a lot of hands-on experience in Jenkins basics like setting up a Jenkins server, choosing and installing Jenkins plugins and building a Jenkins CI/CD pipeline.',
    startDate: '2023-12-04T09:30:00.000Z',
    endDate: '2023-12-05T16:30:00.000Z',
    maxStudents: 8,
  },
  {
    name: 'Robot Framework Fundamentals',
    description:
      'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
    startDate: '2023-11-20T09:30:00.000Z',
    endDate: '2023-11-22T16:30:00.000Z',
    maxStudents: 10,
  },
  {
    name: 'Kubernetes Fundamentals',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    startDate: '2024-01-08T09:30:00.000Z',
    endDate: '2024-01-08T16:30:00.000Z',
    maxStudents: 15,
  },
];

const tagData = [
  { name: 'Testing' },
  { name: 'CI/CD' },
  { name: 'Agile methods' },
  { name: 'Docker' },
  { name: 'Kubernetes' },
  { name: 'Git' },
];

async function main() {
  await prisma.course.createMany({
    data: courseData,
    skipDuplicates: true,
  });
  await prisma.tag.createMany({
    data: tagData,
    skipDuplicates: true,
  });
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
