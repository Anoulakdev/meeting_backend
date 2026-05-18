import { PrismaService } from '../../../prisma/prisma.service';
import moment from 'moment-timezone';

export async function detailDoc(prisma: PrismaService) {
  const details = await prisma.detailDoc.findMany({
    orderBy: {
      id: 'desc',
    },
    include: {
      meetingDoc: true,
      detailDocAssigns: true,
    },
  });

  return details.map((detail) => {
    return {
      ...detail,
      dateActive: moment(detail.dateActive).format('YYYY-MM-DD'),
      meetingDoc: {
        ...detail.meetingDoc,
        startDate: moment(detail.meetingDoc.startDate).format('YYYY-MM-DD'),
        endDate: moment(detail.meetingDoc.endDate).format('YYYY-MM-DD'),
        createdAt: moment(detail.meetingDoc.createdAt)
          .tz('Asia/Vientiane')
          .format(),
        updatedAt: moment(detail.meetingDoc.updatedAt)
          .tz('Asia/Vientiane')
          .format(),
      },
    };
  });
}
