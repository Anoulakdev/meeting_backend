import { PrismaService } from '../../../prisma/prisma.service';

export async function selectRole(prisma: PrismaService) {
  return prisma.role.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
