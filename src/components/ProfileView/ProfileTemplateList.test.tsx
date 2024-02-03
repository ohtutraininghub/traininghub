import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import ProfileTemplateList from './ProfileTemplateList';
import { Template } from '@prisma/client';
import userEvent from '@testing-library/user-event';

const testTemplates: Template[] = [
  {
    id: '1',
    name: 'Kubernetes Fundamentals',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    maxStudents: 15,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
    createdById: '1',
  },
  {
    id: '2',
    name: 'Robot Framework Fundamentals',
    description:
      'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
    maxStudents: 10,
    tags: ['Testing', 'Python', 'Robot Framework'],
    createdById: '2',
  },
];

describe('ProfileTemplateList component', () => {
  it('has a header and expand/close controls', () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={true}
      />
    );
    const headerText = screen.getByTestId('listHeader');
    const controlButton = screen.getByTestId('listControls');
    expect(headerText).toBeInTheDocument();
    expect(controlButton).toBeInTheDocument();
  });

  it('displays a message if the templates list is empty', () => {
    renderWithTheme(
      <ProfileTemplateList headerText="Templates" templates={[]} open={true} />
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
      />
    );
    expect(screen.getByText('(2)', { exact: false })).toBeInTheDocument();
  });

  it('expands when the toggle button is clicked', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={false}
      />
    );
    const controlButton = screen.getByTestId('listControls');
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
    await userEvent.click(controlButton);
    testTemplates.forEach((template) => {
      expect(screen.getByText(template.name)).toBeInTheDocument();
    });
  });

  it('list collapses when collapse button is clicked', async () => {
    renderWithTheme(
      <ProfileTemplateList
        headerText="Templates"
        templates={testTemplates}
        open={true}
      />
    );
    const controlButton = screen.getByTestId('listControls');
    testTemplates.forEach((template) => {
      expect(screen.getByText(template.name)).toBeInTheDocument();
    });
    await userEvent.click(controlButton);
    testTemplates.forEach((template) => {
      expect(screen.queryByText(template.name)).toBeNull();
    });
  });
});