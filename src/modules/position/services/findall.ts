import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllPosition(prisma: PrismaService) {
  return prisma.position.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
