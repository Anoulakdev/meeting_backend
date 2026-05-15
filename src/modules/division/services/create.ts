import { PrismaService } from '../../../prisma/prisma.service';
import { externalApi } from '../../../utils/external-api';

interface Division {
  id: number;
  division_name: string;
  division_code: string;
  division_status: string;
  branch_id: number;
  departmentId: number;
}

async function fetchDivisions(): Promise<Division[]> {
  try {
    const response = await externalApi.get<Division[]>('/divisions');

    return response.data;
  } catch (err: unknown) {
    let message = 'Failed to fetch divisions';
    if (err instanceof Error) message = err.message;
    console.error(message);
    throw new Error(message);
  }
}

export async function createDivision(
  prisma: PrismaService,
  // createDivisionDto: CreateDivisionDto,
) {
  const divisionsData = await fetchDivisions();

  if (Array.isArray(divisionsData) && divisionsData.length === 0) {
    throw new Error('No divisions data retrieved from external API');
  }

  const existing = await prisma.division.findMany({
    select: { id: true },
  });

  const existingIds = new Set(existing.map((d) => d.id));

  let updated = 0;
  let created = 0;

  const batchSize = 50;

  for (let i = 0; i < divisionsData.length; i += batchSize) {
    const batch = divisionsData.slice(i, i + batchSize);

    for (const d of batch) {
      const isNew = !existingIds.has(d.id);

      if (isNew) created++;
      else updated++;

      await prisma.division.upsert({
        where: { id: d.id },
        update: {
          division_name: d.division_name,
          division_code: d.division_code,
          division_status: d.division_status,
          branch_id: d.branch_id,
          departmentId: d.departmentId,
        },
        create: {
          id: d.id,
          division_name: d.division_name,
          division_code: d.division_code,
          division_status: d.division_status,
          branch_id: d.branch_id,
          departmentId: d.departmentId,
        },
      });
    }
  }

  return {
    success: true,
    total: divisionsData.length,
    updated,
    created,
    message: 'Divisions synced successfully',
  };
}
