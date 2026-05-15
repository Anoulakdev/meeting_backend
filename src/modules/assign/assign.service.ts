import { Injectable } from '@nestjs/common';
import { CreateAssignDto } from './dto/create-assign.dto';
import { UpdateAssignDto } from './dto/update-assign.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createAssign } from './services/create';
import { FindAllAssign } from './services/findall';
import { findOneAssign } from './services/findone';
import { updateAssign } from './services/update';

@Injectable()
export class AssignService {
  constructor(private prisma: PrismaService) {}
  create(createAssignDto: CreateAssignDto) {
    return createAssign(this.prisma, createAssignDto);
  }

  findAll(user: AuthUser) {
    return FindAllAssign(this.prisma, user);
  }

  findOne(id: number) {
    return findOneAssign(this.prisma, id);
  }

  update(id: number, updateAssignDto: UpdateAssignDto) {
    return updateAssign(this.prisma, id, updateAssignDto);
  }
}
