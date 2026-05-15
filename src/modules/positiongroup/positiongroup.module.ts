import { Module } from '@nestjs/common';
import { PositiongroupService } from './positiongroup.service';
import { PositiongroupController } from './positiongroup.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PositiongroupController],
  providers: [PositiongroupService, PrismaService],
})
export class PositiongroupModule {}
