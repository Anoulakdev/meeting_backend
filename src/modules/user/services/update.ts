import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

export async function updateUser(
  prisma: PrismaService,
  id: number,
  updateUserDto: UpdateUserDto,
) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException('user not found');

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateUserDto,
  });

  return {
    message: 'User updated successfully',
    data: {
      id: updatedUser.id,
      roleId: updatedUser.roleId,
    },
  };
}
