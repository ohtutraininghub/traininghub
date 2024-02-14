import { render, screen, fireEvent } from '@testing-library/react';
import { EditTemplateForm } from './EditTemplateForm';
import { renderWithTheme } from '@/lib/test-utils';

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

describe('EditTemplateForm', () => {
  it('renders the input sections to the form', () => {
    renderWithTheme(
      <EditTemplateForm
        templateId="templateId"
        updateTemplate={() => {}}
        tags={[]}
        lang="en"
      />
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
      <EditTemplateForm
        templateId="templateId"
        updateTemplate={() => {}}
        tags={[]}
        lang="en"
      />
    );
    // Find the labels by their associated text
    const nameLabel = screen.getByText(/CourseForm\.name/i);
    const descriptionLabel = screen.getByText(/CourseForm\.description/i);
    const summaryLabel = screen.getByText(/CourseForm\.summary/i);
    const imageLabel = screen.getByText(/CourseForm\.courseImage/i);
    const tagsLabel = screen.getByText(/CourseForm\.tags/i);
    const maxStudentsLabel = screen.getByText(/CourseForm\.maxStudents/i);
    // Assert that the names are rendered correctly
    expect(nameLabel).toBeInTheDocument();
    expect(descriptionLabel).toBeInTheDocument();
    expect(summaryLabel).toBeInTheDocument();
    expect(imageLabel).toBeInTheDocument();
    expect(tagsLabel).toBeInTheDocument();
    expect(maxStudentsLabel).toBeInTheDocument();
  });

  it('renders the update button with the correct text', () => {
    renderWithTheme(
      <EditTemplateForm
        templateId="templateId"
        updateTemplate={() => {}}
        tags={[]}
        lang="en"
      />
    );
    const buttonElement = screen.getByTestId('updateTemplateButton');

    // Assert that the update button is rendered correctly
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('EditTemplate.button.update');
  });
});
