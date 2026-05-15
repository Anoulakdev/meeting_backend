import { Injectable } from '@nestjs/common';
// import { CreatePositioncodeDto } from './dto/create-positioncode.dto';
// import { UpdatePositioncodeDto } from './dto/update-positioncode.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createPositionCode } from './services/create';
import { findAllPositionCode } from './services/findall';
import { findOnePositionCode } from './services/findone';

@Injectable()
export class PositioncodeService {
  constructor(private prisma: PrismaService) {}

  create() {
    return createPositionCode(this.prisma);
  }

  findAll() {
    return findAllPositionCode(this.prisma);
  }

  findOne(id: number) {
    return findOnePositionCode(this.prisma, id);
  }
}
