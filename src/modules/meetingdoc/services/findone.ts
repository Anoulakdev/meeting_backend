import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import moment from 'moment-timezone';

export async function findOneMeetingDoc(prisma: PrismaService, id: number) {
  const meeting = await prisma.meetingDoc.findUnique({
    where: { id },
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
      assigns: {
        select: {
          assign: {
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
        },
      },
    },
  });
  if (!meeting) throw new NotFoundException('meeting not found');
  return {
    ...meeting,
    startDate: moment(meeting.startDate).format('YYYY-MM-DD'),
    endDate: moment(meeting.endDate).format('YYYY-MM-DD'),
    createdAt: moment(meeting.createdAt).tz('Asia/Vientiane').format(),
    updatedAt: moment(meeting.updatedAt).tz('Asia/Vientiane').format(),
  };
}
