import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { AssignController } from './assign.controller';
import { PrismaService } from '../../prisma/prisma.service';

import { AssignCronService } from './assign.cron';

@Module({
  controllers: [AssignController],
  providers: [AssignService, PrismaService, AssignCronService],
})
export class AssignModule {}
