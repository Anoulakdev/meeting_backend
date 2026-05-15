import { PrismaService } from '../../../prisma/prisma.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';

export async function removeRole(prisma: PrismaService, id: number) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new NotFoundException('role not found');

  await prisma.role.delete({ where: { id } });
  return {
    statusCode: HttpStatus.OK,
    message: 'role deleted successfully',
  };
}
