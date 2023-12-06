import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import StyledTooltip from '.';
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

describe('StyledTooltip', () => {
  it('renders the icon initially', () => {
    const { container } = renderWithTheme(
      <StyledTooltip title="Extremely useful tooltip" lang="en" />
    );
    const iconElement = container.querySelector('.MuiSvgIcon-root');
    expect(iconElement).toBeInTheDocument();
  });

  it('does not initally show the tooltip text', () => {
    renderWithTheme(
      <StyledTooltip title="Extremely useful tooltip" lang="en" />
    );
    const tooltipContent = screen.queryByText('Extremely useful tooltip');
    expect(tooltipContent).not.toBeInTheDocument();
  });

  it('renders the tooltip content after activation and closes on button click', async () => {
    const { getByText, container } = renderWithTheme(
      <StyledTooltip title="Extremely useful tooltip" lang="en" />
    );
    const iconElement = container.querySelector(
      '.MuiSvgIcon-root'
    ) as HTMLElement;
    fireEvent.mouseEnter(iconElement);

    await waitFor(() => {
      const tooltipContent = getByText('Extremely useful tooltip');
      expect(tooltipContent).toBeInTheDocument();
    });

    const closeButton = getByText('StyledTooltip.button.closeTooltip');
    fireEvent.click(closeButton);

    await waitFor(() => {
      const closedTooltip = container.querySelector('.MuiTooltip-tooltip');
      expect(closedTooltip).toBeNull();
    });
  });

  it('renders the tooltip with a custom placement', async () => {
    const { getByText, container } = renderWithTheme(
      <StyledTooltip
        title="Extremely useful tooltip"
        placement="right"
        lang="en"
      />
    );

    const iconElement = container.querySelector(
      '.MuiSvgIcon-root'
    ) as HTMLElement;
    fireEvent.mouseEnter(iconElement);

    await waitFor(() => {
      const tooltipContent = getByText('Extremely useful tooltip');
      expect(tooltipContent).toBeInTheDocument();
    });
  });

  it('renders the tooltip without an arrow', async () => {
    const { getByText, container } = renderWithTheme(
      <StyledTooltip title="Extremely useful tooltip" arrow={false} lang="en" />
    );

    const iconElement = container.querySelector(
      '.MuiSvgIcon-root'
    ) as HTMLElement;
    fireEvent.mouseEnter(iconElement);

    await waitFor(() => {
      const tooltipContent = getByText('Extremely useful tooltip');
      expect(tooltipContent).toBeInTheDocument();
    });
  });
});
