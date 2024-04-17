import { Course } from '@prisma/client';

export const createNewFormRequest = (course: Course) => {
  return {
    info: {
      title: `Please provide feedback for the course: ${course.name}`,
      document_title: `${course.name} Feedback`,
    },
  };
};

export const createQuizItems = () => {
  return {
    requests: [
      {
        createItem: {
          item: {
            title: 'Rate the course from 1 to 5',
            questionItem: {
              question: {
                required: true,
                scaleQuestion: {
                  low: 1,
                  high: 5,
                  lowLabel: 'Not useful',
                  highLabel: 'Very useful',
                },
              },
            },
          },
          location: {
            index: 0,
          },
        },
      },
      {
        createItem: {
          item: {
            title: 'How was the course?',
            questionItem: {
              question: {
                required: false,
                textQuestion: {
                  paragraph: true,
                },
              },
            },
          },
          location: {
            index: 1,
          },
        },
      },
    ],
  };
};
