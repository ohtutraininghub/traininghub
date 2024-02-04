import { screen } from '@testing-library/react';
import TemplateSelect from './index';
import { renderWithTheme } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

describe('TemplateSelect', () => {
  const mockSetValue = jest.fn();
  const mockTemplates = [
    {
      id: '1',
      name: 'Template 1',
      description: 'Description 1',
      summary: 'Summary 1',
      tags: [
        { id: '1', name: 'Test1' },
        { id: '2', name: 'Test2' },
      ],
      maxStudents: 10,
      createdById: 'user1',
      image: 'http://test-image.com',
    },
    {
      id: '2',
      name: 'Template 2',
      description: 'Description 2',
      summary: 'Summary 2',
      tags: [
        { id: '3', name: 'Test3' },
        { id: '4', name: 'Test4' },
      ],
      maxStudents: 20,
      createdById: 'user2',
      image: 'http://test-image.com',
    },
  ];

  it('renders without crashing', () => {
    renderWithTheme(
      <TemplateSelect
        id="test"
        setValue={mockSetValue}
        templates={mockTemplates}
      />
    );
  });

  it('calls handleTemplateChange when template is selected', async () => {
    const mockHandleTemplateChange = jest.fn();
    renderWithTheme(
      <TemplateSelect
        id="template-select"
        setValue={mockHandleTemplateChange}
        templates={mockTemplates}
      />
    );
    const select = screen.getByRole('combobox');

    // Open the dropdown
    userEvent.click(select);

    // Select the option
    const option = await screen.findByText('Template 2');
    userEvent.click(option);

    await waitFor(() => {
      expect(mockHandleTemplateChange).toHaveBeenCalled();
    });
  });

  it('is two templates in the dropdown', async () => {
    const mockHandleTemplateChange = jest.fn();
    renderWithTheme(
      <TemplateSelect
        id="template-select"
        setValue={mockHandleTemplateChange}
        templates={mockTemplates}
      />
    );
    const select = screen.getByRole('combobox');

    // Open the dropdown
    userEvent.click(select);

    const option1 = await screen.findByText('Template 1');
    const option2 = await screen.findByText('Template 2');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });
});
