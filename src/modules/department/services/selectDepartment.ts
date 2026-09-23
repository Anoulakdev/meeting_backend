import { PrismaService } from '../../../prisma/prisma.service';

export async function selectDepartment(prisma: PrismaService) {
  return prisma.department.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
