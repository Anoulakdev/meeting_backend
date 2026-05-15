import { Injectable } from '@nestjs/common';
// import { CreatePositiongroupDto } from './dto/create-positiongroup.dto';
// import { UpdatePositiongroupDto } from './dto/update-positiongroup.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createPositionGroup } from './services/create';
import { findAllPositionGroup } from './services/findall';
import { findOnePositionGroup } from './services/findone';

@Injectable()
export class PositiongroupService {
  constructor(private prisma: PrismaService) {}

  create() {
    return createPositionGroup(this.prisma);
  }

  findAll() {
    return findAllPositionGroup(this.prisma);
  }

  findOne(id: number) {
    return findOnePositionGroup(this.prisma, id);
  }
}
