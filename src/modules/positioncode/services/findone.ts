import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOnePositionCode(prisma: PrismaService, id: number) {
  const positionCode = await prisma.positionCode.findUnique({
    where: { id },
  });
  if (!positionCode) throw new NotFoundException('Position code not found');
  return positionCode;
}
