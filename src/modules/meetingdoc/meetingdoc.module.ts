import { Module } from '@nestjs/common';
import { MeetingdocService } from './meetingdoc.service';
import { MeetingdocController } from './meetingdoc.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MeetingdocController],
  providers: [MeetingdocService, PrismaService],
})
export class MeetingdocModule {}
