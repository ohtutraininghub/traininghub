import { Role, User as PrismaUser, Course } from '@prisma/client';
import { templateSchemaWithId } from './zod/templates';
type User = Omit<PrismaUser, 'emailVerified'>;

export const isTrainerOrAdmin = (user: User) =>
  user.role === Role.TRAINER || user.role === Role.ADMIN;

export const isAdmin = (user: User) => user.role === Role.ADMIN;

export const isTrainer = (user: User) => user.role === Role.TRAINER;

export const hasCourseEditRights = (user: User) =>
  isAdmin(user) || isTrainer(user);

export const hasCourseDeleteRights = (user: User, course: Course) =>
  user.id === course.createdById || isAdmin(user);

export const hasTemplateDeleteRights = (
  user: User,
  template: { createdById: string }
) => user.id === template.createdById || isAdmin(user);

export const hasTemplateEditRights = (
  user: User,
  template: ReturnType<typeof templateSchemaWithId.parse>
) => user.id === template.createdById || isAdmin(user);
