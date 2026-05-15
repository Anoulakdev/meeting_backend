import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRoleDto } from '../dto/create-role.dto';

export async function createRole(
  prisma: PrismaService,
  createRoleDto: CreateRoleDto,
) {
  return prisma.role.create({
    data: createRoleDto,
  });
}
