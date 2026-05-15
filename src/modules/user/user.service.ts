import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createUser } from './services/create';
import { findAllUser } from './services/findall';
import { findOneUser } from './services/findone';
import { updateUser } from './services/update';
import { adminFindAll } from './services/adminfindall';
import { changePassword } from './services/changePassword';
import { resetPassword } from './services/resetPassword';
import { updateStatus } from './services/updateStatus';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create() {
    return createUser(this.prisma);
  }

  findAll(divisionId?: number) {
    return findAllUser(this.prisma, divisionId);
  }

  adminFindAll(user: AuthUser) {
    return adminFindAll(this.prisma, user);
  }

  findOne(id: number) {
    return findOneUser(this.prisma, id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUser(this.prisma, id, updateUserDto);
  }

  updateStatus(id: number, actived: string) {
    return updateStatus(this.prisma, id, actived);
  }

  changePassword(id: number, dto: ChangePasswordDto) {
    return changePassword(this.prisma, id, dto);
  }

  resetPassword(id: number) {
    return resetPassword(this.prisma, id);
  }
}
