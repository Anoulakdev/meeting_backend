import { Injectable } from '@nestjs/common';
import { CreateRelatedassignDto } from './dto/create-relatedassign.dto';
import { UpdateRelatedassignDto } from './dto/update-relatedassign.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createAssign } from './services/create';
import { FindAllAssign, FindAllRelatedAssignOptions } from './services/findall';
import { findOneAssign } from './services/findone';
import { updateAssign } from './services/update';

@Injectable()
export class RelatedassignService {
  constructor(private prisma: PrismaService) {}

  create(createRelatedassignDto: CreateRelatedassignDto) {
    return createAssign(this.prisma, createRelatedassignDto);
  }

  findAll(user: AuthUser, options?: FindAllRelatedAssignOptions) {
    return FindAllAssign(this.prisma, user, options);
  }

  findOne(id: number) {
    return findOneAssign(this.prisma, id);
  }

  update(id: number, updateRelatedassignDto: UpdateRelatedassignDto) {
    return updateAssign(this.prisma, id, updateRelatedassignDto);
  }
}
