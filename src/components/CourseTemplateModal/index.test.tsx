import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CourseTemplateModal from '../CourseTemplateModal';
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
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      refresh: jest.fn(),
    };
  },
}));

let mockUpdate = jest.fn(async (...args) => {
  return Promise.resolve({
    message: 'Template successfully updated',
    status: 201,
    messageType: 'success',
  });
});

jest.mock('../../lib/response/fetchUtil', () => ({
  update: () => mockUpdate,
}));

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

describe('CourseTemplateModal', () => {
  it('closes modal when close button is clicked', () => {
    // Mock onClose function
    const onCloseMock = jest.fn();

    // Render the modal
    const { getByTestId } = renderWithTheme(
      <CourseTemplateModal
        lang="en"
        template={testTemplate}
        onClose={onCloseMock}
        tags={[]}
      />
    );

    // Find close button and click it
    const closeButton = getByTestId('closeButton');
    fireEvent.click(closeButton);

    // Check if onClose function is called
    expect(onCloseMock).toHaveBeenCalled();
  });
});
