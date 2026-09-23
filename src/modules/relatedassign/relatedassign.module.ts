import { Module } from '@nestjs/common';
import { RelatedassignService } from './relatedassign.service';
import { RelatedassignController } from './relatedassign.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [RelatedassignController],
  providers: [RelatedassignService, PrismaService],
})
export class RelatedassignModule {}
