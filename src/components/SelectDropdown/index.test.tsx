import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectDropdown from '.';

describe('SelectDropdown', () => {
  const items = [
    { id: '1', name: 'Finland', countryCode: 'FI' },
    { id: '2', name: 'Sweden', countryCode: 'SE' },
  ];

  const mockField = {
    name: 'country',
    value: '',
    onChange: jest.fn(),
    onBlur: jest.fn(),
  };

  it('should render dropdown with items', async () => {
    render(
      <SelectDropdown items={items} label="countrySelect" field={mockField} />
    );
    expect(
      screen.getByRole('combobox', { name: 'countrySelect' })
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('combobox', { name: 'countrySelect' })
    );
    items.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('calls onChange when item is selected', async () => {
    render(
      <SelectDropdown items={items} label="countrySelect" field={mockField} />
    );
    await userEvent.click(
      screen.getByRole('combobox', { name: 'countrySelect' })
    );
    await userEvent.click(
      within(screen.getByRole('listbox')).getByText(items[0].name)
    );
    expect(mockField.onChange).toHaveBeenCalled();
  });

  it('has the correct accessibility attributes', async () => {
    render(
      <SelectDropdown items={items} label="countrySelect" field={mockField} />
    );
    const combobox = screen.getByRole('combobox', { name: 'countrySelect' });
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
  });
});
