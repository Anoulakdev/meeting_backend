import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllUser(prisma: PrismaService, divisionId?: number) {
  const where = divisionId
    ? { employee: { divisionId: Number(divisionId) } }
    : undefined;

  return prisma.user.findMany({
    where: where,
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      username: true,
      employeeId: true,
      roleId: true,
      role: true,
      employee: {
        include: {
          department: true,
          division: true,
          office: true,
          unit: true,
          position: true,
        },
      },
    },
  });
}
