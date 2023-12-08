import { Role, User as PrismaUser } from '@prisma/client';

type User = Omit<PrismaUser, 'emailVerified'>;

export const isTrainerOrAdmin = (user: User) =>
  user.role === Role.TRAINER || user.role === Role.ADMIN;

export const isAdmin = (user: User) => user.role === Role.ADMIN;

export const isTrainer = (user: User) => user.role === Role.TRAINER;

export const hasCourseEditRights = (user: User) =>
  isAdmin(user) || isTrainer(user);
