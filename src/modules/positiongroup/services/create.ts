import { PrismaService } from '../../../prisma/prisma.service';
import { externalApi } from '../../../utils/external-api';

interface Positiongroup {
  id: number;
  pos_group_name: string;
}

async function fetchPositionGroups(): Promise<Positiongroup[]> {
  try {
    const response = await externalApi.get<Positiongroup[]>('/positiongroups');

    return response.data;
  } catch (err: unknown) {
    let message = 'Failed to fetch position groups';
    if (err instanceof Error) message = err.message;
    console.error(message);
    throw new Error(message);
  }
}

export async function createPositionGroup(prisma: PrismaService) {
  const positionGroupsData = await fetchPositionGroups();

  if (!positionGroupsData.length) {
    throw new Error('No position groups data retrieved from external API');
  }

  let updated = 0;
  let created = 0;

  const existing = await prisma.positionGroup.findMany({
    select: { id: true },
  });
  const existingIds = new Set(existing.map((e) => e.id));

  const batchSize = 50;

  for (let i = 0; i < positionGroupsData.length; i += batchSize) {
    const batch = positionGroupsData.slice(i, i + batchSize);

    for (const d of batch) {
      const isNew = !existingIds.has(d.id);

      if (isNew) created++;
      else updated++;

      await prisma.positionGroup.upsert({
        where: { id: d.id },
        update: { pos_group_name: d.pos_group_name },
        create: {
          id: d.id,
          pos_group_name: d.pos_group_name,
        },
      });
    }
  }

  return {
    success: true,
    total: positionGroupsData.length,
    updated,
    created,
    message: 'Position groups synced successfully',
  };
}
