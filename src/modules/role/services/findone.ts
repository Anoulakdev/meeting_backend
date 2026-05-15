import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneRole(prisma: PrismaService, id: number) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new NotFoundException('role not found');
  return role;
}
