import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import ProfileTemplateList from './ProfileTemplateList';
import userEvent from '@testing-library/user-event';
import { TemplateWithCreator } from '@/lib/prisma/templates';

// Mocking translation and fetch utilities
jest.mock('../../lib/i18n/client', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// Providing mock implementations for useRouter, used by DeleteTemplateButton
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// Mocking the remove function, used by DeleteTemplateButton
jest.mock('../../lib/response/fetchUtil', () => ({
  remove: jest.fn().mockResolvedValue({ status: 200 }),
}));

const testTemplates: TemplateWithCreator[] = [
  {
    id: '1',
    name: 'Kubernetes Fundamentals',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    maxStudents: 15,
    tags: [
      { id: '1', name: 'Kubernetes' },
      { id: '2', name: 'Docker' },
      { id: '3', name: 'CI/CD' },
    ],
    createdById: '1',
    createdBy: {
      name: 'Timmy',
    },
    summary:
      'Learn the basics of Kubernetes and start your cloud native journey!',
    image: 'http://test-image.com',
  },
  {
    id: '2',
    name: 'Robot Framework Fundamentals',
    description:
      'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
    maxStudents: 10,
    tags: [
      { id: '4', name: 'Testing' },
      { id: '5', name: 'Python' },
      { id: '6', name: 'Robot Framework' },
    ],
    createdById: '2',
    createdBy: {
      name: 'Tommy',
    },
    summary: 'Automate your acceptance testing with Robot Framework!',
    image: 'http://test-image.com',
  },
];

describe('ProfileTemplateList component', () => {
  it('has a header and expand/close controls', () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={true}
        tags={[]}
      />
    );
    const headerText = screen.getByTestId('templateListHeader');
    const controlButton = screen.getByTestId('templateListControls');
    expect(headerText).toBeInTheDocument();
    expect(controlButton).toBeInTheDocument();
  });

  it('displays a message if the templates list is empty', () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={[]}
        open={true}
        tags={[]}
      />
    );
    const noTemplatesText = screen.getByText('No templates to show.');
    expect(noTemplatesText).toBeInTheDocument();
  });

  it('renders template information when templates are provided and list open', () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={true}
        tags={[]}
      />
    );
    testTemplates.forEach((template) => {
      expect(screen.getByText(template.name)).toBeInTheDocument();
    });
  });

  it('does not render template information if list is closed', () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
        tags={[]}
      />
    );
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
  });

  it('shows the number of templates', () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
        tags={[]}
      />
    );
    expect(screen.getByText('(2)', { exact: false })).toBeInTheDocument();
  });

  it('shows name of template creator', () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={true}
        tags={[]}
      />
    );
    testTemplates.forEach((template) => {
      if (template.createdBy?.name) {
        expect(screen.getByText(template.createdBy.name)).toBeInTheDocument();
      }
    });
  });

  it('expands when the toggle button is clicked', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
        tags={[]}
      />
    );
    const controlButton = screen.getByTestId('templateListControls');
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
    await userEvent.click(controlButton);
    testTemplates.forEach((template) => {
      expect(screen.getByText(template.name)).toBeInTheDocument();
    });
  });

  it('edit button visible when expanded', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
        tags={[]}
      />
    );
    const controlButton = screen.getByTestId('templateListControls');
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
    await userEvent.click(controlButton);
    const buttonElement = screen.getAllByTestId('EditTemplateButton');
    testTemplates.forEach((template) => {
      expect(buttonElement[0]).toBeInTheDocument();
    });
  });

  it('delete button visible when expanded', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
        tags={[]}
      />
    );
    const controlButton = screen.getByTestId('templateListControls');
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
    await userEvent.click(controlButton);
    const buttonElement = screen.getAllByTestId('DeleteTemplateButton');
    testTemplates.forEach((template) => {
      expect(buttonElement[0]).toBeInTheDocument();
    });
  });

  it('edit button visible when expanded', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
        tags={[]}
      />
    );
    const controlButton = screen.getByTestId('templateListControls');
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
    await userEvent.click(controlButton);
    const buttonElement = screen.getAllByTestId('EditTemplateButton');
    testTemplates.forEach((template) => {
      expect(buttonElement[0]).toBeInTheDocument();
    });
  });

  it('search bar visible when expanded', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
        tags={[]}
      />
    );
    const controlButton = screen.getByTestId('templateListControls');
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
    await userEvent.click(controlButton);

    const searchBar = screen.getByTestId('TemplateSearchBar');
    expect(searchBar).toBeInTheDocument();
  });

  it('Template modal is opened when edit button is clicked', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
        tags={[]}
      />
    );
    const controlButton = screen.getByTestId('templateListControls');
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
    await userEvent.click(controlButton);

    const buttonElement = screen.getAllByTestId('EditTemplateButton');
    testTemplates.forEach((template) => {
      expect(buttonElement[0]).toBeInTheDocument();
    });

    await userEvent.click(buttonElement[0]);
    expect(screen.getByTestId('template-modal')).toBeInTheDocument();
  });

  it('list collapses when collapse button is clicked', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={true}
        tags={[]}
      />
    );
    const controlButton = screen.getByTestId('templateListControls');
    testTemplates.forEach((template) => {
      expect(screen.getByText(template.name)).toBeInTheDocument();
    });
    await userEvent.click(controlButton);
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
  });
});
