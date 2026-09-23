import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import moment from 'moment-timezone';

export async function findOneAssign(prisma: PrismaService, id: number) {
  const assign = await prisma.relatedAssign.findUnique({
    where: { id },
    include: {
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
    },
  });
  if (!assign) throw new NotFoundException('Assign not found');
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
}
