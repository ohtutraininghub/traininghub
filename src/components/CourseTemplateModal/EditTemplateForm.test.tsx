import { screen } from '@testing-library/react';
import { EditTemplateForm } from './EditTemplateForm';
import { renderWithTheme } from '@/lib/test-utils';

import path from 'path';
import { NextRequest } from 'next/server';

jest.mock('../../lib/i18n/client', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

// const mockPut = jest.fn();
// jest.mock('../../app/api/template/', () => {
//   PUT: (req: NextRequest) => mockPut(req);
// });

const testTemplate = {
  id: '123456789',
  name: 'testTemplate',
  description: 'templateDescription',
  summary: 'templateSummary',
  tags: [{ name: 'tag1', id: 'tagId' }],
  image: '',
  maxStudents: 0,
  createdById: 'userId',
};

describe('EditTemplateForm', () => {
  beforeEach(() => {
    console.log();
  });
  it('renders the input sections to the form', () => {
    console.log('current path: ', path.resolve(__dirname));
    console.log('next path: ', path.resolve(__dirname, '..', '..'));

    renderWithTheme(
      <EditTemplateForm templateData={testTemplate} tags={[]} lang="en" />
    );

    const name = screen.getByTestId('templateFormName');
    const summary = screen.getByTestId('templateFormSummary');
    const image = screen.getByTestId('templateFormImage');
    const maxStudents = screen.getByTestId('templateFormMaxStudents');
    // Assert that input elements of the form are rendered
    expect(name).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(maxStudents).toBeInTheDocument();
  });

  it('renders the form labels with correct text', () => {
    renderWithTheme(
      <EditTemplateForm templateData={testTemplate} tags={[]} lang="en" />
    );
    // Find the labels by their associated text
    const formTitle = screen.getByText(/TemplateForm\.title/i);
    const nameLabel = screen.getByText(/CourseForm\.name/i);
    const descriptionLabel = screen.getByText(/CourseForm\.description/i);
    const summaryLabel = screen.getByText(/CourseForm\.summary/i);
    const imageLabel = screen.getByText(/CourseForm\.courseImage/i);
    const tagsLabel = screen.getByText(/CourseForm\.tags/i);
    const maxStudentsLabel = screen.getByText(/CourseForm\.maxStudents/i);
    // Assert that the names are rendered correctly
    expect(formTitle).toHaveTextContent('TemplateForm.title');
    expect(nameLabel).toHaveTextContent('CourseForm.name');
    expect(descriptionLabel).toHaveTextContent('CourseForm.description');
    expect(summaryLabel).toHaveTextContent('CourseForm.summary');
    expect(imageLabel).toHaveTextContent('CourseForm.courseImage');
    expect(tagsLabel).toHaveTextContent('CourseForm.tags');
    expect(maxStudentsLabel).toHaveTextContent('CourseForm.maxStudents');
  });

  it('renders the update button with the correct text', () => {
    renderWithTheme(
      <EditTemplateForm templateData={testTemplate} tags={[]} lang="en" />
    );
    const buttonElement = screen.getByTestId('updateTemplateButton');

    // Assert that the update button is rendered correctly
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('TemplateForm.update');
  });
});
