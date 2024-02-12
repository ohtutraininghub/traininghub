import { prisma } from '.';
import { Template, Prisma as prismaClient } from '@prisma/client';

export type TemplateWithTags = prismaClient.TemplateGetPayload<{
  include: {
    tags: true;
  };
}>;

export type TemplateWithCreator = prismaClient.TemplateGetPayload<{
  include: {
    createdBy: {
      select: {
        name: true;
      };
    };
    tags: true;
  };
}>;

export const getTemplatesWithCreator = async () => {
  return await prisma.template.findMany({
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
      tags: true,
    },
    orderBy: { name: 'asc' },
  });
};

export const getTemplatesByUserIdWithCreator = async (
  userId: Template['createdById']
) => {
  return await prisma.template.findMany({
    where: {
      createdById: userId,
    },
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
      tags: true,
    },
  });
};

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
