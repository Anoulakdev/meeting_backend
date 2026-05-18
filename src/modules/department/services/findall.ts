import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllDepartment(prisma: PrismaService) {
  return prisma.department.findMany({
    orderBy: {
      department_code: 'asc',
    },
  });
}
