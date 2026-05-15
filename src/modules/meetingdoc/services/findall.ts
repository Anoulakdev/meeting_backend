import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import moment from 'moment-timezone';

export async function FindAllMeetingDoc(prisma: PrismaService, user: AuthUser) {
  const meetings = await prisma.meetingDoc.findMany({
    where: {
      createdById: user.id,
    },
    orderBy: {
      id: 'desc',
    },
    include: {
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
    },
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
