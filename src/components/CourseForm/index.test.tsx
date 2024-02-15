import React from 'react';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
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

jest.mock('../TextEditor', () => ({
  __esModule: true,
  default: jest.fn(({ value, onChange }) => {
    React.useEffect(() => {
      onChange(value);
    }, [value]);

    return (
      <textarea
        data-testid="courseFormDescription"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }),
}));

describe('Course Form Course Create Tests', () => {
  const user = userEvent.setup();

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
  const courseStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const courseEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const oneDayBeforeStart = new Date();

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
    tags: [
      { id: '1', name: 'Testing' },
      { id: '2', name: 'Git' },
    ],
    image: 'http://test-image.com',
  };

  const setNativeValue = (element: HTMLInputElement, value: string) => {
    // sets date and time input values
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

  it('Form wont be submitted if the required fields are empty', async () => {
    renderWithTheme(<CourseForm lang="en" tags={[]} templates={[]} />);

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).not.toBeCalled();
    });
  });

  it('Form is submitted with the optional fields empty in Create Mode', async () => {
    renderWithTheme(
      <CourseForm lang="en" tags={course.tags} templates={[template]} />
    );

    // find input fields
    const nameInput = screen.getByTestId('courseFormName') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('courseFormDescription');
    const maxStudentsInput = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;
    const tagsInput = screen.getByRole('combobox', {
      name: /CourseForm.tags/i,
    });

    // fill in the input fields
    await user.type(nameInput, course.name);
    await user.type(descriptionInput, course.description);
    // clear the default value before typing
    await userEvent.clear(maxStudentsInput);
    await user.type(maxStudentsInput, course.maxStudents.toString());

    await user.click(tagsInput);

    course.tags.forEach((tag) => {
      const option = screen.getByText(tag.name);
      user.click(option);
    });

    // set the date and time input values
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
        name: course.name,
        description: course.description,
        tags: course.tags.map((tag) => tag.name),
        summary: '',
        image: '',
        startDate: new Date(course.startDate.toISOString().slice(0, 16)),
        endDate: new Date(course.endDate.toISOString().slice(0, 16)),
        lastEnrollDate: null,
        lastCancelDate: null,
        maxStudents: course.maxStudents,
      });
    });
  });

  it('All form fields can be filled with values in Create Mode', async () => {
    renderWithTheme(
      <CourseForm lang="en" tags={course.tags} templates={[template]} />
    );

    // find all input fields
    const nameInput = screen.getByTestId('courseFormName') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('courseFormDescription');
    const summaryInput = screen.getByTestId(
      'courseFormSummary'
    ) as HTMLInputElement;
    const maxStudentsInput = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;
    const imageInput = screen.getByTestId(
      'courseFormImage'
    ) as HTMLInputElement;
    const tagsInput = screen.getByRole('combobox', {
      name: /CourseForm.tags/i,
    });

    // fill in the input fields
    await user.type(nameInput, course.name);
    await user.type(descriptionInput, course.description);
    await user.type(summaryInput, course.summary);
    // clear the default value before typing
    await userEvent.clear(maxStudentsInput);
    await user.type(maxStudentsInput, course.maxStudents.toString());
    await user.type(imageInput, course.image);

    await user.click(tagsInput);

    course.tags.forEach((tag) => {
      const option = screen.getByText(tag.name);
      user.click(option);
    });

    // set the date and time input values
    const startDateInput = screen.getByTestId(
      'courseFormStartDate'
    ) as HTMLInputElement;
    setNativeValue(startDateInput, courseStart.toISOString().slice(0, 16));

    const endDateInput = screen.getByTestId(
      'courseFormEndDate'
    ) as HTMLInputElement;
    setNativeValue(endDateInput, courseEnd.toISOString().slice(0, 16));

    const lastEnrollDateInput = screen.getByTestId(
      'courseFormLastEnrollDate'
    ) as HTMLInputElement;
    setNativeValue(
      lastEnrollDateInput,
      oneDayBeforeStart.toISOString().slice(0, 16)
    );

    const lastCancelDateInput = screen.getByTestId(
      'courseFormLastCancelDate'
    ) as HTMLInputElement;
    setNativeValue(
      lastCancelDateInput,
      oneDayBeforeStart.toISOString().slice(0, 16)
    );

    // check if the input fields have the correct values
    expect(startDateInput.value).toBe(
      course.startDate.toISOString().slice(0, 16)
    );
    expect(endDateInput.value).toBe(course.endDate.toISOString().slice(0, 16));
    expect(lastEnrollDateInput.value).toBe(
      oneDayBeforeStart.toISOString().slice(0, 16)
    );
    expect(lastCancelDateInput.value).toBe(
      oneDayBeforeStart.toISOString().slice(0, 16)
    );
    expect(nameInput.value).toBe(course.name);
    expect(descriptionInput).toHaveTextContent(course.description);
    expect(summaryInput.value).toBe(course.summary);
    expect(maxStudentsInput.value).toBe(course.maxStudents.toString());
    expect(imageInput.value).toBe(course.image);
    course.tags.forEach((tag) => {
      const chip = screen.getByText(tag.name);
      expect(chip).toBeInTheDocument();
    });
  });

  it('Form is submitted with correct values in Create Mode', async () => {
    renderWithTheme(
      <CourseForm lang="en" tags={course.tags} templates={[template]} />
    );

    // find all input fields
    const nameInput = screen.getByTestId('courseFormName') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('courseFormDescription');
    const summaryInput = screen.getByTestId(
      'courseFormSummary'
    ) as HTMLInputElement;
    const maxStudentsInput = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;
    const imageInput = screen.getByTestId(
      'courseFormImage'
    ) as HTMLInputElement;
    const tagsInput = screen.getByRole('combobox', {
      name: /CourseForm.tags/i,
    });

    // fill in the input fields
    await user.type(nameInput, course.name);
    await user.type(descriptionInput, course.description);
    await user.type(summaryInput, course.summary);
    // clear the default value before typing
    await userEvent.clear(maxStudentsInput);
    await user.type(maxStudentsInput, course.maxStudents.toString());
    await user.type(imageInput, course.image);

    await user.click(tagsInput);

    course.tags.forEach((tag) => {
      const option = screen.getByText(tag.name);
      user.click(option);
    });

    const startDateInput = screen.getByTestId(
      'courseFormStartDate'
    ) as HTMLInputElement;
    setNativeValue(startDateInput, courseStart.toISOString().slice(0, 16));

    const endDateInput = screen.getByTestId(
      'courseFormEndDate'
    ) as HTMLInputElement;
    setNativeValue(endDateInput, courseEnd.toISOString().slice(0, 16));

    const lastEnrollDateInput = screen.getByTestId(
      'courseFormLastEnrollDate'
    ) as HTMLInputElement;
    setNativeValue(
      lastEnrollDateInput,
      oneDayBeforeStart.toISOString().slice(0, 16)
    );

    const lastCancelDateInput = screen.getByTestId(
      'courseFormLastCancelDate'
    ) as HTMLInputElement;
    setNativeValue(
      lastCancelDateInput,
      oneDayBeforeStart.toISOString().slice(0, 16)
    );

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        name: course.name,
        description: course.description,
        tags: course.tags.map((tag) => tag.name),
        summary: course.summary,
        image: course.image,
        startDate: new Date(course.startDate.toISOString().slice(0, 16)),
        endDate: new Date(course.endDate.toISOString().slice(0, 16)),
        lastEnrollDate: new Date(oneDayBeforeStart.toISOString().slice(0, 16)),
        lastCancelDate: new Date(oneDayBeforeStart.toISOString().slice(0, 16)),
        maxStudents: Number(course.maxStudents),
      });
    });
  });

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
    renderWithTheme(<CourseForm lang="en" tags={[]} templates={[template]} />);
    const select = screen.getByRole('combobox', {
      name: /Template.selectTemplate/i,
    });

    userEvent.click(select);

    const option = await screen.findByText('New course');
    userEvent.click(option);

    await waitFor(() => {
      const name = screen.getByTestId('courseFormName') as HTMLInputElement;
      const description = screen.getByTestId(
        'courseFormDescription'
      ) as HTMLInputElement;
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
    renderWithTheme(<CourseForm lang="en" tags={[]} templates={[template]} />);

    const select = screen.getByRole('combobox', {
      name: /Template.selectTemplate/i,
    });

    userEvent.click(select);

    const option = await screen.findByText('New course');
    userEvent.click(option);

    // dates are not present in a template, so we need to set them manually
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
        name: template.name,
        description: template.description,
        summary: template.summary,
        maxStudents: 55,
        image: template.image,
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
    id: '1234',
    name: 'New course',
    description: 'A test course',
    summary: 'All you ever wanted to know about testing!',
    tags: [{ id: '1', name: 'Testing' }],
    maxStudents: 55,
    createdById: '30',
    image: 'http://test-image.com',
  };

  it('Template dropdown is not displayed in Edit Mode', async () => {
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

    renderWithTheme(
      <CourseForm
        lang="en"
        tags={[]}
        courseData={course}
        templates={[template]}
      />
    );
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

    renderWithTheme(
      <CourseForm
        lang="en"
        tags={[]}
        courseData={course}
        templates={[template]}
      />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    const description = screen.getByTestId(
      'courseFormDescription'
    ) as HTMLInputElement;
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

    renderWithTheme(
      <CourseForm
        lang="en"
        tags={[]}
        courseData={course}
        templates={[template]}
      />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    const description = screen.getByTestId(
      'courseFormDescription'
    ) as HTMLInputElement;
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

  it('Form is submitted with correct values in Edit Mode when values have been edited', async () => {
    mockFetch.mockClear();
    const user = userEvent.setup();

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
    const tags = [
      { id: '1', name: 'Testing' },
      { id: '2', name: 'Git' },
    ];

    const editedCourse = {
      id: '1234',
      createdById: '30',
      name: 'New edited course',
      description: 'A test course which has been edited',
      summary: 'Updated version of the course',
      startDate: courseStart,
      endDate: courseEnd,
      lastEnrollDate: oneDayBeforeStart,
      lastCancelDate: oneDayBeforeStart,
      maxStudents: 40,
      tags: [{ id: '2', name: 'Git' }],
      image: 'http://test-image.com',
    };

    renderWithTheme(
      <CourseForm lang="en" tags={tags} courseData={course} templates={[]} />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    await user.clear(name);
    await user.type(name, editedCourse.name);

    const description = screen.getByTestId('courseFormDescription');
    await user.type(description, ' which has been edited');

    const summary = screen.getByTestId('courseFormSummary') as HTMLInputElement;
    await user.clear(summary);
    await user.type(summary, editedCourse.summary);

    const maxStudents = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;
    await user.clear(maxStudents);
    await user.type(maxStudents, editedCourse.maxStudents.toString());

    const image = screen.getByTestId('courseFormImage') as HTMLInputElement;
    await user.type(image, editedCourse.image);

    const tagsInput = screen.getByRole('combobox', {
      name: /CourseForm.tags/i,
    });
    await user.click(tagsInput);
    const option = screen.getByText(tags[1].name);
    await user.click(option);

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        ...editedCourse,
        endDate: new Date(course.endDate),
        startDate: new Date(course.startDate),
        lastEnrollDate: new Date(course.lastEnrollDate),
        lastCancelDate: new Date(course.lastCancelDate),
        maxStudents: Number(editedCourse.maxStudents),
        tags: [tags[1].name],
      });
    });
  });

  it('should not be possible to clear name field and submit', async () => {
    mockFetch.mockClear();
    const user = userEvent.setup();

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

    renderWithTheme(
      <CourseForm lang="en" tags={[]} courseData={course} templates={[]} />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    await user.clear(name);

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).not.toBeCalled();
    });
  });
});
