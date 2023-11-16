/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

import { Role } from '@prisma/client';

enum Task {
  clearDatabase,
}

declare global {
  namespace Cypress {
    interface Chainable {
      getCy(selector: string): Chainable<JQuery<HTMLElement>>;
      login(email: string, role: Role): Chainable<void>;
    }
  }
}
