import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneUnit(prisma: PrismaService, id: number) {
  const unit = await prisma.unit.findUnique({ where: { id } });
  if (!unit) throw new NotFoundException('unit not found');
  return unit;
}
