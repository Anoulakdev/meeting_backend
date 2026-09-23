import { Injectable } from '@nestjs/common';
import { CreateRelateddocDto } from './dto/create-relateddoc.dto';
import { UpdateRelateddocDto } from './dto/update-relateddoc.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createRelatedDoc } from './services/create';
import {
  FindAllRelatedDoc,
  FindAllRelatedDocOptions,
} from './services/findall';
import { findOneRelatedDoc } from './services/findone';
import { updateRelatedDoc } from './services/update';
import { removeRelatedDoc } from './services/remove';

@Injectable()
export class RelateddocService {
  constructor(private prisma: PrismaService) {}

  create(
    createRelateddocDto: CreateRelateddocDto,
    user: AuthUser,
    Docfilename: string,
  ) {
    return createRelatedDoc(
      this.prisma,
      user,
      createRelateddocDto,
      Docfilename,
    );
  }

  findAll(user: AuthUser, options?: FindAllRelatedDocOptions) {
    return FindAllRelatedDoc(this.prisma, user, options);
  }

  findOne(id: number) {
    return findOneRelatedDoc(this.prisma, id);
  }

  update(id: number, user: AuthUser, updateRelateddocDto: UpdateRelateddocDto) {
    return updateRelatedDoc(this.prisma, id, user, updateRelateddocDto);
  }

  remove(id: number, user: AuthUser) {
    return removeRelatedDoc(this.prisma, id, user);
  }
}
