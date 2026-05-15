import {
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from '../dto/change-password.dto';

export async function changePassword(
  prisma: PrismaService,
  id: number,
  dto: ChangePasswordDto,
) {
  const { oldpassword, password1, password2 } = dto;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new NotFoundException('User not found');

  const isPasswordValid = await bcrypt.compare(oldpassword, user.password);
  if (!isPasswordValid) {
    throw new BadRequestException('Old password is incorrect');
  }

  if (password1 !== password2) {
    throw new BadRequestException('Password not match');
  }

  const hashedPassword = await bcrypt.hash(password1, 10);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return {
    statusCode: HttpStatus.OK,
    message: 'Change password successfully',
  };
}
