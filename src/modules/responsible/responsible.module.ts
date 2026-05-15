import { Module } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { ResponsibleController } from './responsible.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ResponsibleController],
  providers: [ResponsibleService, PrismaService],
})
export class ResponsibleModule {}
