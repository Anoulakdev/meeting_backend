import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { Prisma } from '../../../../generated/prisma/client';
import moment from 'moment-timezone';

export class FindAllAssignOptions {
  page?: number | string;
  limit?: number | string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export async function FindAllAssign(
  prisma: PrismaService,
  user: AuthUser,
  options: FindAllAssignOptions = {},
) {
  const where: Prisma.AssignWhereInput = {
    assignId: user.id,
  };

  const meetingDocWhere: Prisma.MeetingDocWhereInput = {};

  if (options.startDate) {
    meetingDocWhere.startDate = {
      gte: moment
        .tz(options.startDate, 'Asia/Vientiane')
        .startOf('day')
        .toDate(),
    };
  }

  if (options.endDate) {
    meetingDocWhere.endDate = {
      lte: moment
        .tz(options.endDate, 'Asia/Vientiane')
        .endOf('day')
        .toDate(),
    };
  }

  if (options.search) {
    const searchLower = options.search.trim();
    if (searchLower) {
      meetingDocWhere.OR = [
        { title: { contains: searchLower, mode: 'insensitive' } },
        { location: { contains: searchLower, mode: 'insensitive' } },
        { description: { contains: searchLower, mode: 'insensitive' } },
      ];
    }
  }

  if (Object.keys(meetingDocWhere).length > 0) {
    where.meetingDoc = meetingDocWhere;
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
    meetingDoc: true,
  };

  if (page !== undefined || limit !== undefined) {
    page = page && !isNaN(page) && page > 0 ? page : 1;
    limit = limit && !isNaN(limit) && limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.assign.findMany({
        where,
        orderBy: {
          meetingDocId: 'desc',
        },
        include,
        skip,
        take,
      }),
      prisma.assign.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const mappedData = data.map((assign) => {
      return {
        ...assign,
        meetingDoc: {
          ...assign.meetingDoc,
          startDate: moment(assign.meetingDoc.startDate)
            .tz('Asia/Vientiane')
            .format('YYYY-MM-DD'),
          endDate: moment(assign.meetingDoc.endDate)
            .tz('Asia/Vientiane')
            .format('YYYY-MM-DD'),
          createdAt: moment(assign.meetingDoc.createdAt)
            .tz('Asia/Vientiane')
            .format(),
          updatedAt: moment(assign.meetingDoc.updatedAt)
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

  const assigns = await prisma.assign.findMany({
    where,
    orderBy: {
      meetingDocId: 'desc',
    },
    include,
  });

  return assigns.map((assign) => {
    return {
      ...assign,
      meetingDoc: {
        ...assign.meetingDoc,
        startDate: moment(assign.meetingDoc.startDate)
          .tz('Asia/Vientiane')
          .format('YYYY-MM-DD'),
        endDate: moment(assign.meetingDoc.endDate)
          .tz('Asia/Vientiane')
          .format('YYYY-MM-DD'),
        createdAt: moment(assign.meetingDoc.createdAt)
          .tz('Asia/Vientiane')
          .format(),
        updatedAt: moment(assign.meetingDoc.updatedAt)
          .tz('Asia/Vientiane')
          .format(),
      },
    };
  });
}
