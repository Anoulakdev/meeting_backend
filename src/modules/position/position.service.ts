import { Injectable } from '@nestjs/common';
// import { CreatePositionDto } from './dto/create-position.dto';
// import { UpdatePositionDto } from './dto/update-position.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createPosition } from './services/create';
import { findAllPosition } from './services/findall';
import { findOnePosition } from './services/findone';

@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService) {}

  create() {
    return createPosition(this.prisma);
  }

  findAll() {
    return findAllPosition(this.prisma);
  }

  findOne(id: number) {
    return findOnePosition(this.prisma, id);
  }
}
