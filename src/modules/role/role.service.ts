import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createRole } from './services/create';
import { findAllRole } from './services/findall';
import { findOneRole } from './services/findone';
import { updateRole } from './services/update';
import { removeRole } from './services/remove';
import { selectRole } from './services/selectRole';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  create(createRoleDto: CreateRoleDto) {
    return createRole(this.prisma, createRoleDto);
  }

  findAll() {
    return findAllRole(this.prisma);
  }

  selectRole() {
    return selectRole(this.prisma);
  }

  findOne(id: number) {
    return findOneRole(this.prisma, id);
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return updateRole(this.prisma, id, updateRoleDto);
  }

  remove(id: number) {
    return removeRole(this.prisma, id);
  }
}
