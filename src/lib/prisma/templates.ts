import { prisma } from '.';
import { Template, Prisma as prismaClient } from '@prisma/client';

export type TemplateWithTags = prismaClient.TemplateGetPayload<{
  include: {
    tags: true;
  };
}>;

export const getTemplatesByUserId = async (userId: Template['createdById']) => {
  const userTemplates = await prisma.template.findMany({
    where: {
      createdById: userId,
    },
    include: {
      tags: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  const otherTemplates = await prisma.template.findMany({
    where: {
      createdById: {
        not: userId,
      },
    },
    include: {
      tags: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return [...userTemplates, ...otherTemplates];
};
