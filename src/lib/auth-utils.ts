import { Course, Role, User as PrismaUser } from '@prisma/client';
import { CourseSchemaWithIdType } from './zod/courses';

type User = Omit<PrismaUser, 'emailVerified'>;

export const isTrainerOrAdmin = (user: User) =>
  user.role === Role.TRAINER || user.role === Role.ADMIN;

export const isAdmin = (user: User) => user.role === Role.ADMIN;

export const isTrainer = (user: User) => user.role === Role.TRAINER;

export const hasCourseEditRights = (
  user: User,
  course: Course | CourseSchemaWithIdType
) =>
  user.role === Role.ADMIN ||
  (isTrainer(user) && course.createdById === user.id);
