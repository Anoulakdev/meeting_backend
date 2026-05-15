import { Module } from '@nestjs/common';
import { PositioncodeService } from './positioncode.service';
import { PositioncodeController } from './positioncode.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PositioncodeController],
  providers: [PositioncodeService, PrismaService],
})
export class PositioncodeModule {}
