/* eslint-disable no-unused-vars */
import { DefaultUser } from 'next-auth';
import type { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: Role;
      countryId: string;
      titleId: string;
      profileCompleted: boolean;
    };
  }
  types;
  interface User extends DefaultUser {
    role: Role;
    profileCompleted: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    profileCompleted: boolean;
  }
}
