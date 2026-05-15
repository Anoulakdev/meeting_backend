import { PrismaService } from '../../../prisma/prisma.service';
import { externalApi } from '../../../utils/external-api';

interface Positioncode {
  id: number;
  pos_code_name: string;
  pos_code_status: string;
  posgroupId: number;
}

async function fetchPositionCodes(): Promise<Positioncode[]> {
  try {
    const response = await externalApi.get<Positioncode[]>('/positioncodes');

    return response.data;
  } catch (err: unknown) {
    let message = 'Failed to fetch position codes';
    if (err instanceof Error) message = err.message;
    console.error(message);
    throw new Error(message);
  }
}

export async function createPositionCode(
  prisma: PrismaService,
  // createUnitDto: CreateUnitDto,
) {
  const positionCodesData = await fetchPositionCodes();

  if (!positionCodesData.length) {
    throw new Error('No position codes data retrieved from external API');
  }

  let updated = 0;
  let created = 0;

  const existing = await prisma.positionCode.findMany({
    select: { id: true },
  });
  const existingIds = new Set(existing.map((e) => e.id));

  const batchSize = 50;

  for (let i = 0; i < positionCodesData.length; i += batchSize) {
    const batch = positionCodesData.slice(i, i + batchSize);

    for (const d of batch) {
      const isNew = !existingIds.has(d.id);

      if (isNew) created++;
      else updated++;

      await prisma.positionCode.upsert({
        where: { id: d.id },
        update: {
          pos_code_name: d.pos_code_name,
          pos_code_status: d.pos_code_status,
          posgroupId: d.posgroupId,
        },
        create: {
          id: d.id,
          pos_code_name: d.pos_code_name,
          pos_code_status: d.pos_code_status,
          posgroupId: d.posgroupId,
        },
      });
    }
  }

  return {
    success: true,
    total: positionCodesData.length,
    updated,
    created,
    message: 'Position codes synced successfully',
  };
}
