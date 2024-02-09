import React from 'react';
import '@testing-library/jest-dom';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/lib/test-utils';
import CourseForm from '.';
import { dateToDateTimeLocal } from '@/lib/timedateutils';

window.alert = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

jest.mock('../Providers/MessageProvider', () => ({
  useMessage() {
    return {
      notify: jest.fn(),
    };
  },
}));

var mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);

jest.mock('../../lib/response/fetchUtil', () => ({
  post: (...args: any[]) => mockFetch(...args),
  update: (...args: any[]) => mockFetch(...args),
}));

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

describe('Course Form Course Create Tests', () => {
  const template = {
    id: '1234',
    name: 'New course',
    description: 'A test course',
    summary: 'All you ever wanted to know about testing!',
    tags: [{ id: '1', name: 'Testing' }],
    maxStudents: 55,
    createdById: '30',
    image: 'http://test-image.com',
  };

  it('Template select wont be displayed if there is no saved templates', async () => {
    renderWithTheme(<CourseForm lang="en" tags={[]} templates={[]} />);
    const selectTemplateText = screen.queryByText(/Template.selectTemplate/i);
    expect(selectTemplateText).toBeNull();
  });

  it('Template select text and dropdown box is displayed if there is saved templates', async () => {
    renderWithTheme(<CourseForm lang="en" tags={[]} templates={[template]} />);

    const selectTemplateText = screen.queryByText(/Template.selectTemplate/i);
    expect(selectTemplateText).toBeInTheDocument();

    const templateSelectBox = screen.getByRole('combobox', {
      name: /Template.selectTemplate/i,
    });
    expect(templateSelectBox).toBeInTheDocument();
  });

  it('updates the value of the field when a template is selected', async () => {
    const { container } = renderWithTheme(
      <CourseForm lang="en" tags={[]} templates={[template]} />
    );
    const select = screen.getByRole('combobox', {
      name: /Template.selectTemplate/i,
    });

    userEvent.click(select);

    const option = await screen.findByText('New course');
    userEvent.click(option);

    await waitFor(() => {
      const name = screen.getByTestId('courseFormName') as HTMLInputElement;
      const description = container.querySelector('.tiptap');
      const summary = screen.getByTestId(
        'courseFormSummary'
      ) as HTMLInputElement;
      const maxStudents = screen.getByTestId(
        'courseFormMaxStudents'
      ) as HTMLInputElement;
      const image = screen.getByTestId('courseFormImage') as HTMLInputElement;

      expect(name.value).toBe(template.name);
      expect(description).toHaveTextContent(template.description);
      expect(summary.value).toBe(template.summary);
      expect(maxStudents.value).toBe(template.maxStudents.toString());
      expect(image.value).toBe(template.image);

      template.tags.forEach((tag) => {
        const chip = screen.getByText(tag.name);
        expect(chip).toBeInTheDocument();
      });
    });
  });

  it('Form is submitted with correct values after selecting template', async () => {
    // dates are not present in a template, so we need to set them manually
    const courseStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const courseEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    renderWithTheme(<CourseForm lang="en" tags={[]} templates={[template]} />);

    const select = screen.getByRole('combobox', {
      name: /Template.selectTemplate/i,
    });

    userEvent.click(select);

    const option = await screen.findByText('New course');
    userEvent.click(option);

    const setNativeValue = (element: HTMLInputElement, value: string) => {
      let lastValue = element.value;
      element.value = value;

      let event = new Event('input', { bubbles: true });

      (event as any).simulated = true;

      let tracker = (element as any)['_valueTracker'];
      if (tracker) {
        tracker.setValue(lastValue);
      }
      element.dispatchEvent(event);
    };

    const startDateInput = screen.getByTestId(
      'courseFormStartDate'
    ) as HTMLInputElement;
    setNativeValue(startDateInput, courseStart.toISOString().slice(0, 16));

    const endDateInput = screen.getByTestId(
      'courseFormEndDate'
    ) as HTMLInputElement;
    setNativeValue(endDateInput, courseEnd.toISOString().slice(0, 16));

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        name: 'New course',
        description: 'A test course',
        summary: 'All you ever wanted to know about testing!',
        maxStudents: 55,
        image: 'http://test-image.com',
        endDate: new Date(courseEnd.toISOString().slice(0, 16)),
        startDate: new Date(courseStart.toISOString().slice(0, 16)),
        lastCancelDate: null,
        lastEnrollDate: null,
        tags: template.tags.map((tag) => tag.name),
      });
    });
  });
});

describe('Course Form Course Edit Tests', () => {
  const courseStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const courseEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const oneDayBeforeStart = new Date();

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

  it('Template dropdown is not displayed in Edit Mode', async () => {
    const selectTemplate = screen.queryByText(/Template.selectTemplate/i);
    expect(selectTemplate).toBeNull();
  });

  it('Form is filled with course values in Edit Mode', async () => {
    const course = {
      id: '1234',
      createdById: '30',
      name: 'New course',
      description: 'A test course',
      summary: 'All you ever wanted to know about testing!',
      startDate: courseStart,
      endDate: courseEnd,
      lastEnrollDate: oneDayBeforeStart,
      lastCancelDate: oneDayBeforeStart,
      maxStudents: 55,
      tags: [],
      image: '',
    };

    const { container } = renderWithTheme(
      <CourseForm
        lang="en"
        tags={[]}
        courseData={course}
        templates={[template]}
      />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    const description = container.querySelector('.tiptap');
    const startDate = screen.getByTestId(
      'courseFormStartDate'
    ) as HTMLInputElement;
    const endDate = screen.getByTestId('courseFormEndDate') as HTMLInputElement;
    const lastEnrollDate = screen.getByTestId(
      'courseFormLastEnrollDate'
    ) as HTMLInputElement;
    const lastCancelDate = screen.getByTestId(
      'courseFormLastCancelDate'
    ) as HTMLInputElement;
    const maxStudents = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;
    const summary = screen.getByTestId('courseFormSummary') as HTMLInputElement;

    expect(name.value).toBe(course.name);
    expect(description).toHaveTextContent(course.description);
    expect(summary.value).toBe(course.summary);
    expect(maxStudents.value).toBe(course.maxStudents.toString());
    expect(startDate.value).toBe(dateToDateTimeLocal(course.startDate));
    expect(endDate.value).toBe(dateToDateTimeLocal(course.endDate));
    expect(lastEnrollDate.value).toBe(
      dateToDateTimeLocal(course.lastEnrollDate)
    );
    expect(lastCancelDate.value).toBe(
      dateToDateTimeLocal(course.lastCancelDate)
    );
  });

  it('Form is filled with course values in Edit Mode when last enroll and last cancel dates are null', async () => {
    const course = {
      id: '1234',
      createdById: '30',
      name: 'New course',
      description: 'A test course',
      summary: 'All you ever wanted to know about testing!',
      startDate: new Date(),
      endDate: new Date(),
      lastEnrollDate: null,
      lastCancelDate: null,
      maxStudents: 55,
      tags: [],
      image: '',
    };

    const { container } = renderWithTheme(
      <CourseForm
        lang="en"
        tags={[]}
        courseData={course}
        templates={[template]}
      />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    const description = container.querySelector('.tiptap');
    const startDate = screen.getByTestId(
      'courseFormStartDate'
    ) as HTMLInputElement;
    const endDate = screen.getByTestId('courseFormEndDate') as HTMLInputElement;
    const lastEnrollDate = screen.getByTestId(
      'courseFormLastEnrollDate'
    ) as HTMLInputElement;
    const lastCancelDate = screen.getByTestId(
      'courseFormLastCancelDate'
    ) as HTMLInputElement;
    const maxStudents = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;
    const summary = screen.getByTestId('courseFormSummary') as HTMLInputElement;

    expect(name.value).toBe(course.name);
    expect(description).toHaveTextContent(course.description);
    expect(summary.value).toBe(course.summary);
    expect(maxStudents.value).toBe(course.maxStudents.toString());
    expect(startDate.value).toBe(dateToDateTimeLocal(course.startDate));
    expect(endDate.value).toBe(dateToDateTimeLocal(course.endDate));
    expect(lastEnrollDate.value).toBe('');
    expect(lastCancelDate.value).toBe('');
  });

  it('Form is submitted with correct values in Edit Mode', async () => {
    const course = {
      id: '1234',
      createdById: '30',
      name: 'New course',
      description: '<p>A test course</p>',
      summary: 'All you ever wanted to know about testing!',
      startDate: courseStart,
      endDate: courseEnd,
      lastEnrollDate: oneDayBeforeStart,
      lastCancelDate: oneDayBeforeStart,
      maxStudents: 55,
      tags: [],
      image: '',
    };

    renderWithTheme(
      <CourseForm
        lang="en"
        tags={[]}
        courseData={course}
        templates={[template]}
      />
    );

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        ...course,
        endDate: new Date(course.endDate),
        maxStudents: Number(course.maxStudents),
        startDate: new Date(course.startDate),
        lastEnrollDate: new Date(course.lastEnrollDate),
        lastCancelDate: new Date(course.lastCancelDate),
      });
    });
  });

  it('Form is submitted with correct values in Edit Mode when last enroll and last cancel dates are null', async () => {
    const course = {
      id: '1234',
      createdById: '30',
      name: 'New course',
      description: 'A test course',
      summary: 'All you ever wanted to know about testing!',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      lastEnrollDate: null,
      lastCancelDate: null,
      maxStudents: 55,
      tags: [],
      image: '',
    };

    renderWithTheme(
      <CourseForm
        lang="en"
        tags={[]}
        courseData={course}
        templates={[template]}
      />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    const startDate = screen.getByTestId(
      'courseFormStartDate'
    ) as HTMLInputElement;
    const endDate = screen.getByTestId('courseFormEndDate') as HTMLInputElement;
    const lastEnrollDate = screen.getByTestId(
      'courseFormLastEnrollDate'
    ) as HTMLInputElement;
    const lastCancelDate = screen.getByTestId(
      'courseFormLastCancelDate'
    ) as HTMLInputElement;
    const maxStudents = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;
    const summary = screen.getByTestId('courseFormSummary') as HTMLInputElement;

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        ...course,
        startDate: new Date(course.startDate),
        endDate: new Date(course.endDate),
        lastEnrollDate: null,
        lastCancelDate: null,
        maxStudents: Number(course.maxStudents),
      });
    });
  });
});
