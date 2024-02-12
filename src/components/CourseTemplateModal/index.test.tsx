import { render, screen } from '@testing-library/react';
import CourseTemplateModal from '../CourseTemplateModal';

describe('CourseTemplateModal', () => {
  it('renders with a templateId', () => {
    const templateId = '1';

    render(
      <CourseTemplateModal
        templateId={templateId}
        open={true}
        onClose={() => {}}
      />
    );

    const element = screen.getByText('Template ID: 1');
    expect(element).toBeInTheDocument();
  });
});
