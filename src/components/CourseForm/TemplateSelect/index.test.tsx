import { screen } from '@testing-library/react';
import TemplateSelect from './index';
import { renderWithTheme } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

const mockSetValue = jest.fn();

describe('TemplateSelect Tests', () => {
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

  it('calls handleTemplateChange when template is selected', async () => {
    renderWithTheme(
      <TemplateSelect
        id="templateSelect"
        setValue={mockSetValue}
        templates={mockTemplates}
      />
    );
    const select = screen.getByRole('combobox');

    userEvent.click(select);
    const option = await screen.findByText('Template 2');

    await waitFor(() => {
      userEvent.click(option);
      expect(mockSetValue).toHaveBeenCalled();
    });
  });

  it('is two templates in the dropdown', async () => {
    const mockHandleTemplateChange = jest.fn();
    renderWithTheme(
      <TemplateSelect
        id="templateSelect"
        setValue={mockHandleTemplateChange}
        templates={mockTemplates}
      />
    );
    const select = screen.getByRole('combobox');
    userEvent.click(select);

    await waitFor(() => {
      const option1 = screen.getByText('Template 1');
      const option2 = screen.getByText('Template 2');

      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();
    });
  });
});
