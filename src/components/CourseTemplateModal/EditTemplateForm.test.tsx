import { screen } from '@testing-library/react';
import { EditTemplateForm } from './EditTemplateForm';
import { renderWithTheme } from '@/lib/test-utils';

import path from 'path';

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

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      replace: jest.fn(),
    };
  },
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

const mockFetch = jest.fn();
jest.mock('../../lib/response/fetchUtil', () => ({
  update: (...args: any[]) => mockFetch(...args),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

const mockOnClose = jest.fn();

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
  describe('EditTemplateForm Form Appearance Tests', () => {
    const template = {
      id: '',
      name: '',
      description: '',
      summary: '',
      tags: [],
      maxStudents: 0,
      createdById: '',
      image: '',
    };
    beforeEach(() => {
      renderWithTheme(
        <EditTemplateForm
          templateData={template}
          tags={[]}
          lang="en"
          onClose={mockOnClose}
        />
      );
    });
    it('renders the input sections to the form', () => {
      console.log('current path: ', path.resolve(__dirname));
      console.log('next path: ', path.resolve(__dirname, '..', '..'));

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
      const buttonElement = screen.getByTestId('updateTemplateButton');

      // Assert that the update button is rendered correctly
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('TemplateForm.update');
    });
  });

  describe('EditTemplateForm Autofill Tests', () => {
    //Template data with all fields:
    const allFields = {
      id: '1',
      name: 'New course',
      description: 'A test course',
      summary: 'All you ever wanted to know about testing!',
      tags: [{ id: '1', name: 'Testing' }],
      maxStudents: 55,
      createdById: '30',
      image: 'http://test-image.com',
    };

    //Template data with only required fields (name and description):
    const onlyRequiredFields = {
      id: '2',
      name: 'New course',
      description: 'A test course',
      summary: null,
      tags: [],
      maxStudents: 10, //default value
      createdById: '30',
      image: null,
    };

    it('autofills correct values when template had all fields filled', () => {
      const { container } = renderWithTheme(
        <EditTemplateForm
          templateData={allFields}
          tags={[]}
          lang="en"
          onClose={mockOnClose}
        />
      );
      const name = screen.getByTestId('templateFormName') as HTMLInputElement;
      const description = container.querySelector('.tiptap');
      const summary = screen.getByTestId(
        'templateFormSummary'
      ) as HTMLInputElement;
      const maxStudents = screen.getByTestId(
        'templateFormMaxStudents'
      ) as HTMLInputElement;
      const image = screen.getByTestId('templateFormImage') as HTMLInputElement;

      expect(name.value).toBe(allFields.name);
      expect(description).toHaveTextContent(allFields.description);
      expect(summary.value).toBe(allFields.summary);
      expect(maxStudents.value).toBe(allFields.maxStudents.toString());
      expect(image.value).toBe(allFields.image);
    });

    it('autofills correct values when template had only required fields filled', () => {
      const { container } = renderWithTheme(
        <EditTemplateForm
          templateData={onlyRequiredFields}
          tags={[]}
          lang="en"
          onClose={mockOnClose}
        />
      );
      const name = screen.getByTestId('templateFormName') as HTMLInputElement;
      const description = container.querySelector('.tiptap');
      const summary = screen.getByTestId(
        'templateFormSummary'
      ) as HTMLInputElement;
      const maxStudents = screen.getByTestId(
        'templateFormMaxStudents'
      ) as HTMLInputElement;
      const image = screen.getByTestId('templateFormImage') as HTMLInputElement;

      expect(name.value).toBe(onlyRequiredFields.name);
      expect(description).toHaveTextContent(onlyRequiredFields.description);
      expect(summary.value).toBe('');
      expect(maxStudents.value).toBe(onlyRequiredFields.maxStudents.toString());
      expect(image.value).toBe('');
    });

    it('autofills with tags', () => {
      allFields.tags.forEach((tag) => {
        const chip = screen.getByText(tag.name);
        expect(chip).toBeInTheDocument();
      });
    });

    it('autofills without tags', () => {
      const { container } = renderWithTheme(
        <EditTemplateForm
          templateData={onlyRequiredFields}
          tags={[]}
          lang="en"
          onClose={mockOnClose}
        />
      );
      const tags = container.querySelectorAll('.tag');
      expect(tags).toHaveLength(0);
    });
  });
});
