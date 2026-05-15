import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllPositionGroup(prisma: PrismaService) {
  return prisma.positionGroup.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
