import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneDepartment(prisma: PrismaService, id: number) {
  const department = await prisma.department.findUnique({ where: { id } });
  if (!department) throw new NotFoundException('department not found');
  return department;
}
