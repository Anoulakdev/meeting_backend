import { Injectable } from '@nestjs/common';
// import { CreateUnitDto } from './dto/create-unit.dto';
// import { UpdateUnitDto } from './dto/update-unit.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createUnit } from './services/create';
import { findAllUnit } from './services/findall';
import { findOneUnit } from './services/findone';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  create() {
    return createUnit(this.prisma);
  }

  findAll(divisionId?: number, officeId?: number) {
    return findAllUnit(this.prisma, divisionId, officeId);
  }

  findOne(id: number) {
    return findOneUnit(this.prisma, id);
  }
}
