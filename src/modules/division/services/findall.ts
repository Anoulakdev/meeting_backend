import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllDivision(
  prisma: PrismaService,
  departmentId?: number,
) {
  const where = departmentId
    ? { departmentId: Number(departmentId) }
    : undefined;

  return prisma.division.findMany({
    where: where,
    orderBy: {
      id: 'asc',
    },
  });
}
