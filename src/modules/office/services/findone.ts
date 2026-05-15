import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneOffice(prisma: PrismaService, id: number) {
  const office = await prisma.office.findUnique({ where: { id } });
  if (!office) throw new NotFoundException('office not found');
  return office;
}
