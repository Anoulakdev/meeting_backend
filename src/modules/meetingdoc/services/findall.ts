import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { Prisma } from '../../../../generated/prisma/client';
import moment from 'moment-timezone';

export class FindAllMeetingDocOptions {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export async function FindAllMeetingDoc(
  prisma: PrismaService,
  user: AuthUser,
  options: FindAllMeetingDocOptions = {},
) {
  const where: Prisma.MeetingDocWhereInput = {
    createdById: user.id,
  };

  if (options.startDate) {
    where.startDate = {
      gte: moment(options.startDate).startOf('day').toDate(),
    };
  }

  if (options.endDate) {
    where.endDate = {
      lte: moment(options.endDate).endOf('day').toDate(),
    };
  }

  if (options.search) {
    const searchLower = options.search.trim();
    if (searchLower) {
      where.OR = [
        { title: { contains: searchLower, mode: 'insensitive' } },
        { location: { contains: searchLower, mode: 'insensitive' } },
        { description: { contains: searchLower, mode: 'insensitive' } },
      ];
    }
  }

  const page = options.page ? Number(options.page) : undefined;
  const limit = options.limit ? Number(options.limit) : undefined;

  const include = {
    createdBy: {
      select: {
        id: true,
        employee: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            gender: true,
            emp_code: true,
          },
        },
      },
    },
    assigns: true,
  };

  if (page !== undefined && limit !== undefined) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.meetingDoc.findMany({
        where,
        orderBy: {
          id: 'desc',
        },
        include,
        skip,
        take,
      }),
      prisma.meetingDoc.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const mappedData = data.map((meeting) => {
      return {
        ...meeting,
        startDate: moment(meeting.startDate).format('YYYY-MM-DD'),
        endDate: moment(meeting.endDate).format('YYYY-MM-DD'),
        createdAt: moment(meeting.createdAt).tz('Asia/Vientiane').format(),
        updatedAt: moment(meeting.updatedAt).tz('Asia/Vientiane').format(),
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

  const meetings = await prisma.meetingDoc.findMany({
    where,
    orderBy: {
      id: 'desc',
    },
    include,
  });

  return meetings.map((meeting) => {
    return {
      ...meeting,
      startDate: moment(meeting.startDate).format('YYYY-MM-DD'),
      endDate: moment(meeting.endDate).format('YYYY-MM-DD'),
      createdAt: moment(meeting.createdAt).tz('Asia/Vientiane').format(),
      updatedAt: moment(meeting.updatedAt).tz('Asia/Vientiane').format(),
    };
  });
}
