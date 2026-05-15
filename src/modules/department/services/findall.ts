import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllDepartment(prisma: PrismaService) {
  return prisma.department.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
