import { Module } from '@nestjs/common';
import { RelateddocService } from './relateddoc.service';
import { RelateddocController } from './relateddoc.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [RelateddocController],
  providers: [RelateddocService, PrismaService],
})
export class RelateddocModule {}
