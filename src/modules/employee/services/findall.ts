import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllEmployee(prisma: PrismaService) {
  return prisma.employee.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
