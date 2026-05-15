import { HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export async function updateStatus(
  prisma: PrismaService,
  id: number,
  actived: string,
) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Optional: validate allowed status values
  const allowedStatuses = ['A', 'C']; // A = Active, C = Inactive
  if (!allowedStatuses.includes(actived)) {
    throw new Error('Invalid status value');
  }

  await prisma.user.update({
    where: { id },
    data: { status: actived },
  });

  return {
    statusCode: HttpStatus.OK,
    message: 'Update status successfully',
  };
}
