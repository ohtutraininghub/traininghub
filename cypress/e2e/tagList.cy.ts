import { Role } from '@prisma/client';

const adminUser = {
  name: 'Anna Admin',
  email: 'anna@traininghub.org',
  role: Role.ADMIN,
};

describe('Tag list', () => {
  beforeEach(() => {
    cy.task('clearDatabase');
    cy.task('seedDatabase');
    cy.login(adminUser.email, adminUser.role);
    cy.get('[aria-label^="SpeedDial"]').click();
    cy.getCy('dashboard').click();
  });

  it('shows a confirm card when the delete button for a tag is pressed', () => {
    cy.getCy('tag-list')
      .contains('[role="button"]', 'Kubernetes')
      .as('kubernetesTag');
    cy.get('@kubernetesTag').children('[data-testid="CancelIcon"]').click();
    cy.getCy('confirmCard').filter(':visible');
  });

  it('does not delete the tag if cancel button is pressed on the confirm card', () => {
    cy.getCy('tag-list')
      .contains('[role="button"]', 'Kubernetes')
      .as('kubernetesTag');
    cy.get('@kubernetesTag').children('.MuiChip-deleteIcon').click();
    cy.getCy('confirmCard').filter(':visible').as('confirmCard');
    cy.get('@confirmCard').find('[data-testid="confirmCardCancel"]').click();
    cy.get('@confirmCard').should('not.exist');
    cy.get('@kubernetesTag').should('be.visible');
  });

  it('deletes the tag if confirm button is pressed on the confirm card', () => {
    cy.getCy('tag-list')
      .contains('[role="button"]', 'Kubernetes')
      .as('kubernetesTag');
    cy.get('@kubernetesTag').children('.MuiChip-deleteIcon').click();
    cy.getCy('confirmCard').filter(':visible').as('confirmCard');
    cy.get('@confirmCard').find('[data-testid="confirmCardConfirm"]').click();
    cy.get('@confirmCard').should('not.exist');
    cy.get('@kubernetesTag').should('not.exist');
  });
});
