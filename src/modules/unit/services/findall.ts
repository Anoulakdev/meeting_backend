import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllUnit(
  prisma: PrismaService,
  divisionId?: number,
  officeId?: number,
) {
  const where = {
    ...(divisionId && { divisionId: Number(divisionId) }),
    ...(officeId && { officeId: Number(officeId) }),
  };

  return prisma.unit.findMany({
    where: where,
    orderBy: {
      id: 'asc',
    },
  });
}
