import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneEmployee(prisma: PrismaService, id: number) {
  const employee = await prisma.employee.findUnique({
    where: { id },
  });
  if (!employee) throw new NotFoundException('Employee not found');
  return employee;
}
