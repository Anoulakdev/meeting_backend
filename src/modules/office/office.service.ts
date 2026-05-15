import { Injectable } from '@nestjs/common';
// import { CreateOfficeDto } from './dto/create-office.dto';
// import { UpdateOfficeDto } from './dto/update-office.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createOffice } from './services/create';
import { findAllOffice } from './services/findall';
import { findOneOffice } from './services/findone';

@Injectable()
export class OfficeService {
  constructor(private prisma: PrismaService) {}

  create() {
    return createOffice(this.prisma);
  }

  findAll(divisionId?: number) {
    return findAllOffice(this.prisma, divisionId);
  }

  findOne(id: number) {
    return findOneOffice(this.prisma, id);
  }
}
