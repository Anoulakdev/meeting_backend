import { PrismaService } from '../../../prisma/prisma.service';
import { CreateResponsibleDto } from '../dto/create-responsible.dto';

export async function createResponsible(
  prisma: PrismaService,
  createResponsibleDto: CreateResponsibleDto,
) {
  const { userId, divisionId, officeId } = createResponsibleDto;

  if (!userId) {
    throw new Error('userId is required');
  }

  // ❌ ห้ามมีทั้งสอง
  if (divisionId?.length && officeId?.length) {
    throw new Error('Please provide either divisionId or officeId, not both');
  }

  let data: any[] = [];

  // ✅ กรณีมี division
  if (divisionId?.length) {
    data = divisionId.map((divId: number) => ({
      userId: Number(userId),
      divisionId: Number(divId),
    }));
  }

  // ✅ กรณีมี office
  else if (officeId?.length) {
    data = officeId.map((offId: number) => ({
      userId: Number(userId),
      officeId: Number(offId),
    }));
  }

  // ❌ ไม่มีอะไรเลย
  else {
    throw new Error('divisionId or officeId is required');
  }

  return prisma.responsible.createMany({
    data,
    skipDuplicates: true,
  });
}
