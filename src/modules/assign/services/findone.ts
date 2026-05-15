import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import moment from 'moment-timezone';

export async function findOneAssign(prisma: PrismaService, id: number) {
  const assign = await prisma.assign.findUnique({
    where: { id },
    include: {
      meetingDoc: true,
    },
  });
  if (!assign) throw new NotFoundException('Assign not found');
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
}
