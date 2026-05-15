import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateResponsibleDto } from '../dto/update-responsible.dto';

export async function updateResponsible(
  prisma: PrismaService,
  id: number,
  updateResponsibleDto: UpdateResponsibleDto,
) {
  const { divisionId, officeId } = updateResponsibleDto;

  if (!id) {
    throw new Error('id is required');
  }

  // ❌ ห้ามมีทั้งสอง
  if (divisionId?.length && officeId?.length) {
    throw new Error('Please provide either divisionId or officeId, not both');
  }

  if (!divisionId?.length && !officeId?.length) {
    throw new Error('divisionId or officeId is required');
  }

  return prisma.$transaction(async (tx) => {
    // ✅ check user
    const user = await tx.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // ✅ delete ของเก่า
    await tx.responsible.deleteMany({
      where: { userId: Number(id) },
    });

    let data: any[] = [];

    // ✅ กรณี division
    if (divisionId?.length) {
      data = divisionId.map((divId: number) => ({
        userId: Number(id),
        divisionId: Number(divId),
      }));
    }

    // ✅ กรณี office
    else if (officeId?.length) {
      data = officeId.map((offId: number) => ({
        userId: Number(id),
        officeId: Number(offId),
      }));
    }

    // ✅ insert ใหม่
    await tx.responsible.createMany({
      data,
      skipDuplicates: true,
    });

    return {
      message: 'Update responsible success',
      count: data.length,
    };
  });
}
