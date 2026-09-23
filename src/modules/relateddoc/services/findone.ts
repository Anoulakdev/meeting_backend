import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import moment from 'moment-timezone';

export async function findOneRelatedDoc(prisma: PrismaService, id: number) {
  const related = await prisma.relatedDoc.findUnique({
    where: { id },
    include: {
      department: true,
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
      relatedAssigns: {
        select: {
          relatedAssign: {
            select: {
              id: true,
              employee: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  gender: true,
                  emp_code: true,
                  empimg: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!related) throw new NotFoundException('Related document not found');
  return {
    ...related,
    createdAt: moment(related.createdAt).tz('Asia/Vientiane').format(),
    updatedAt: moment(related.updatedAt).tz('Asia/Vientiane').format(),
  };
}
