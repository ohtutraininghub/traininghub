import { NextRequest } from 'next/server';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
} from '@/lib/response/responseUtil';
import { prisma } from '@/lib/prisma';
import { Tag } from '@prisma/client';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { getServerAuthSession } from '@/lib/auth';
import {
  isTrainerOrAdmin,
  hasTemplateDeleteRights,
  hasTemplateEditRights,
} from '@/lib/auth-utils';
import { translator } from '@/lib/i18n';
import {
  templateSchema,
  templateDeleteSchema,
  templateSchemaWithId,
} from '@/lib/zod/templates';

const parseTags = async (tags: string[]): Promise<Tag[]> => {
  const allTags = await prisma.tag.findMany();
  return allTags.filter((e) => tags.includes(e.name));
};

const getTemplateById = async (id: string) => {
  return await prisma.template.findFirst({ where: { id } });
};

export async function POST(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    if (!isTrainerOrAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    const data = await request.json();
    const body = templateSchema.parse(data);
    const parsedTags = await parseTags(body.tags);

    const templateNameInUse = await prisma.template.findFirst({
      where: { name: body.name },
    });

    if (templateNameInUse) {
      return errorResponse({
        message: t('Templates.templateNameInUse'),
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }

    await prisma.template.create({
      data: {
        ...body,
        createdById: user.id,
        tags: {
          connect: parsedTags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    return successResponse({
      message: t('Templates.templateCreated'),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    const reqData = await request.json();
    const template = templateDeleteSchema.parse(reqData);

    const templateExists = await getTemplateById(template.templateId);

    if (!templateExists) {
      return errorResponse({
        message: t('Common.templateNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!isTrainerOrAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    if (!hasTemplateDeleteRights(user, templateExists)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    await prisma.template.delete({
      where: {
        id: template.templateId,
      },
    });

    return successResponse({
      message: t('Templates.templateDeleted'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();

    if (!isTrainerOrAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    const data = await request.json();
    console.log('data', data);
    const body = templateSchemaWithId.parse(data);
    const parsedTags = await parseTags(body.tags);
    const templateExists = await getTemplateById(body.id);
    if (!templateExists) {
      return errorResponse({
        message: t('Common.templateNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!hasTemplateEditRights(user, body)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    const templatesWithSameName = await prisma.template.findMany({
      where: { name: body.name, NOT: { id: body.id } },
    });
    // checks if the tampalte name is in current user's templates (excluding the current template)
    if (templatesWithSameName.length > 0) {
      return errorResponse({
        message: t('Templates.templateNameInUse'),
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }
    await prisma.template.update({
      where: { id: body.id },
      data: {
        ...body,
        tags: {
          connect: parsedTags.map((tag) => ({ id: tag.id })),
        },
      },
    });
    return successResponse({
      message: t('Templates.templateUpdated'),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}
