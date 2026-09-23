import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { Prisma } from '../../../../generated/prisma/client';
import moment from 'moment-timezone';

export class FindAllRelatedAssignOptions {
  page?: number | string;
  limit?: number | string;
  search?: string;
  departmentId?: number | string;
  startDate?: string;
  endDate?: string;
}

export async function FindAllAssign(
  prisma: PrismaService,
  user: AuthUser,
  options: FindAllRelatedAssignOptions = {},
) {
  const where: Prisma.RelatedAssignWhereInput = {
    relatedAssignId: user.id,
  };

  const relatedDocWhere: Prisma.RelatedDocWhereInput = {};

  if (
    options.departmentId !== undefined &&
    options.departmentId !== null &&
    options.departmentId !== '' &&
    options.departmentId !== 'all' &&
    !isNaN(Number(options.departmentId))
  ) {
    relatedDocWhere.departmentId = Number(options.departmentId);
  }

  if (options.startDate || options.endDate) {
    const createdAtFilter: Prisma.DateTimeFilter = {};
    if (options.startDate && options.startDate.trim() !== '') {
      createdAtFilter.gte = moment
        .tz(options.startDate, 'Asia/Vientiane')
        .startOf('day')
        .toDate();
    }
    if (options.endDate && options.endDate.trim() !== '') {
      createdAtFilter.lte = moment
        .tz(options.endDate, 'Asia/Vientiane')
        .endOf('day')
        .toDate();
    }
    if (Object.keys(createdAtFilter).length > 0) {
      relatedDocWhere.createdAt = createdAtFilter;
    }
  }

  if (options.search) {
    const searchLower = options.search.trim();
    if (searchLower) {
      relatedDocWhere.OR = [
        { title: { contains: searchLower, mode: 'insensitive' } },
        { description: { contains: searchLower, mode: 'insensitive' } },
      ];
    }
  }

  if (Object.keys(relatedDocWhere).length > 0) {
    where.relatedDoc = relatedDocWhere;
  }

  let page =
    options.page !== undefined && options.page !== ''
      ? Number(options.page)
      : undefined;
  let limit =
    options.limit !== undefined && options.limit !== ''
      ? Number(options.limit)
      : undefined;

  const include = {
    relatedDoc: {
      include: {
        department: {
          select: {
            id: true,
            department_name: true,
            department_code: true,
          },
        },
      },
    },
  };

  if (page !== undefined || limit !== undefined) {
    page = page && !isNaN(page) && page > 0 ? page : 1;
    limit = limit && !isNaN(limit) && limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.relatedAssign.findMany({
        where,
        orderBy: {
          id: 'desc',
        },
        include,
        skip,
        take,
      }),
      prisma.relatedAssign.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const mappedData = data.map((assign) => {
      return {
        ...assign,
        relatedDoc: {
          ...assign.relatedDoc,
          createdAt: moment(assign.relatedDoc.createdAt)
            .tz('Asia/Vientiane')
            .format(),
          updatedAt: moment(assign.relatedDoc.updatedAt)
            .tz('Asia/Vientiane')
            .format(),
        },
      };
    });

    return {
      data: mappedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  const assigns = await prisma.relatedAssign.findMany({
    where,
    orderBy: {
      id: 'desc',
    },
    include,
  });

  return assigns.map((assign) => {
    return {
      ...assign,
      relatedDoc: {
        ...assign.relatedDoc,
        createdAt: moment(assign.relatedDoc.createdAt)
          .tz('Asia/Vientiane')
          .format(),
        updatedAt: moment(assign.relatedDoc.updatedAt)
          .tz('Asia/Vientiane')
          .format(),
      },
    };
  });
}
