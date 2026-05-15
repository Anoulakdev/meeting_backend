import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOnePositionGroup(prisma: PrismaService, id: number) {
  const positionGroup = await prisma.positionGroup.findUnique({
    where: { id },
  });
  if (!positionGroup) throw new NotFoundException('Position group not found');
  return positionGroup;
}
