import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOnePosition(prisma: PrismaService, id: number) {
  const position = await prisma.position.findUnique({
    where: { id },
  });
  if (!position) throw new NotFoundException('Position not found');
  return position;
}
