import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllPositionCode(prisma: PrismaService) {
  return prisma.positionCode.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
