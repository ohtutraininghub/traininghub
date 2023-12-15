describe('Tag form tests', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
  });

  it('shoud display the correct error message when a too long tag is submitted', () => {
    const tooLongTag =
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';
    cy.login('admin@test.com', 'ADMIN');
    cy.visit('/admin/dashboard');
    cy.getCy('tagFormInput').type(tooLongTag);
    cy.getCy('tagSubmitButton').click();
    cy.contains('The maximum length for a tag is 50 characters');
  });

  it('should display the correct error message when an empty tag is submitted', () => {
    cy.login('admin@test.com', 'ADMIN');
    cy.visit('/admin/dashboard');
    cy.getCy('tagFormInput').type(' ');
    cy.getCy('tagSubmitButton').click();
    cy.contains('A tag name is required');
  });

  it('should display the correct error message when a tag with extra spaces is submitted', () => {
    cy.login('admin@test.com', 'ADMIN');
    cy.visit('/admin/dashboard');
    cy.getCy('tagFormInput').type('Robot  Framework');
    cy.getCy('tagSubmitButton').click();
    cy.contains('Consecutive spaces are not allowed');
  });
});
