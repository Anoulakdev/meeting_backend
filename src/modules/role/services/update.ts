import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { NotFoundException } from '@nestjs/common';

export async function updateRole(
  prisma: PrismaService,
  id: number,
  updateRoleDto: UpdateRoleDto,
) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new NotFoundException('role not found');

  return prisma.role.update({
    where: { id },
    data: updateRoleDto,
  });
}
