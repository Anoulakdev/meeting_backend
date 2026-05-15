import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllRole(prisma: PrismaService) {
  return prisma.role.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
