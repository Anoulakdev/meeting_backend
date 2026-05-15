import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import moment from 'moment-timezone';

export async function FindAllAssign(prisma: PrismaService, user: AuthUser) {
  const assigns = await prisma.assign.findMany({
    where: {
      assignId: user.id,
    },
    orderBy: {
      meetingDocId: 'desc',
    },
    include: {
      meetingDoc: true,
    },
  });

  return assigns.map((assign) => {
    return {
      ...assign,
      meetingDoc: {
        ...assign.meetingDoc,
        startDate: moment(assign.meetingDoc.startDate).format('YYYY-MM-DD'),
        endDate: moment(assign.meetingDoc.endDate).format('YYYY-MM-DD'),
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
