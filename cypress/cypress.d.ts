/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

import { Role } from '@prisma/client';

declare global {
  namespace Cypress {
    interface Chainable {
      getCy(selector: string): Chainable<JQuery<HTMLElement>>;
      login(email: string, role: Role): Chainable<void>;
      formatDate(value: string, day: number);
    }
  }
}
