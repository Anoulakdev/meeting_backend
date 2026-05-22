import { PrismaService } from '../../../prisma/prisma.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';

export async function removeFcmToken(prisma: PrismaService, id: number) {
  const fcmToken = await prisma.fcmToken.findUnique({ where: { id } });
  if (!fcmToken) throw new NotFoundException('FcmToken not found');

  await prisma.fcmToken.delete({ where: { id } });
  return {
    statusCode: HttpStatus.OK,
    message: 'FcmToken deleted successfully',
  };
}
