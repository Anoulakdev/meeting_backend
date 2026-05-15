import { PrismaService } from '../../../prisma/prisma.service';
import { externalApi } from '../../../utils/external-api';

interface Unit {
  id: number;
  unit_name: string;
  unit_code: string;
  unit_status: string;
  unit_type: string;
  divisionId: number;
  officeId: number;
}

async function fetchUnits(): Promise<Unit[]> {
  try {
    const response = await externalApi.get<Unit[]>('/units');

    return response.data;
  } catch (err: unknown) {
    let message = 'Failed to fetch units';
    if (err instanceof Error) message = err.message;
    console.error(message);
    throw new Error(message);
  }
}

export async function createUnit(
  prisma: PrismaService,
  // createUnitDto: CreateUnitDto,
) {
  const unitsData = await fetchUnits();

  if (Array.isArray(unitsData) && unitsData.length === 0) {
    throw new Error('No units data retrieved from external API');
  }

  const existing = await prisma.unit.findMany({
    select: { id: true },
  });

  const existingIds = new Set(existing.map((d) => d.id));

  let updated = 0;
  let created = 0;

  const batchSize = 50;

  for (let i = 0; i < unitsData.length; i += batchSize) {
    const batch = unitsData.slice(i, i + batchSize);

    for (const d of batch) {
      const isNew = !existingIds.has(d.id);

      if (isNew) created++;
      else updated++;

      await prisma.unit.upsert({
        where: { id: d.id },
        update: {
          unit_name: d.unit_name,
          unit_code: d.unit_code,
          unit_status: d.unit_status,
          unit_type: d.unit_type,
          divisionId: d.divisionId,
          officeId: d.officeId,
        },
        create: {
          id: d.id,
          unit_name: d.unit_name,
          unit_code: d.unit_code,
          unit_status: d.unit_status,
          unit_type: d.unit_type,
          divisionId: d.divisionId,
          officeId: d.officeId,
        },
      });
    }
  }

  return {
    success: true,
    total: unitsData.length,
    updated,
    created,
    message: 'Units synced successfully',
  };
}
