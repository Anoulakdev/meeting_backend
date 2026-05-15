import { Injectable } from '@nestjs/common';
// import { CreateDivisionDto } from './dto/create-division.dto';
// import { UpdateDivisionDto } from './dto/update-division.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createDivision } from './services/create';
import { findAllDivision } from './services/findall';
import { findOneDivision } from './services/findone';

@Injectable()
export class DivisionService {
  constructor(private readonly prisma: PrismaService) {}

  create() {
    return createDivision(this.prisma);
  }

  findAll(departmentId?: number) {
    return findAllDivision(this.prisma, departmentId);
  }

  findOne(id: number) {
    return findOneDivision(this.prisma, id);
  }
}
