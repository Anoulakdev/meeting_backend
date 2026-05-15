import { Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [OfficeController],
  providers: [OfficeService, PrismaService],
})
export class OfficeModule {}
