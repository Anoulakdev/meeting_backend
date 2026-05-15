import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneUser(prisma: PrismaService, id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      employeeId: true,
      roleId: true,
      role: true,
      employee: {
        include: {
          department: true,
          division: true,
          office: true,
          unit: true,
          position: true,
        },
      },
      responsibles: {
        select: {
          divisionId: true,
          division: true,
          officeId: true,
          office: true,
        },
      },
    },
  });
  if (!user) throw new NotFoundException('User not found');
  return user;
}
