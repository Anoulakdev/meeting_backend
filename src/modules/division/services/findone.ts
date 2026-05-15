import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneDivision(prisma: PrismaService, id: number) {
  const division = await prisma.division.findUnique({ where: { id } });
  if (!division) throw new NotFoundException('division not found');
  return division;
}
