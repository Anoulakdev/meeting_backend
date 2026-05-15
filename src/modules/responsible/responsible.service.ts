import { Injectable } from '@nestjs/common';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createResponsible } from './services/create';
import { updateResponsible } from './services/update';

@Injectable()
export class ResponsibleService {
  constructor(private prisma: PrismaService) {}

  create(createResponsibleDto: CreateResponsibleDto) {
    return createResponsible(this.prisma, createResponsibleDto);
  }

  // findAll() {
  //   return `This action returns all responsible`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} responsible`;
  // }

  update(id: number, updateResponsibleDto: UpdateResponsibleDto) {
    return updateResponsible(this.prisma, id, updateResponsibleDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} responsible`;
  // }
}
