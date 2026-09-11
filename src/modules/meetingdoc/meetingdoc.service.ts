import { Injectable } from '@nestjs/common';
import { CreateMeetingdocDto } from './dto/create-meetingdoc.dto';
import { UpdateMeetingdocDto } from './dto/update-meetingdoc.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createMeetingDoc } from './services/create';
import {
  FindAllMeetingDoc,
  FindAllMeetingDocOptions,
} from './services/findall';
import { findOneMeetingDoc } from './services/findone';
import { updateMeetingDoc } from './services/update';
import { removeMeetingDoc } from './services/remove';

@Injectable()
export class MeetingdocService {
  constructor(private prisma: PrismaService) {}
  create(
    createMeetingdocDto: CreateMeetingdocDto,
    user: AuthUser,
    Docfilename: string,
  ) {
    return createMeetingDoc(
      this.prisma,
      user,
      createMeetingdocDto,
      Docfilename,
    );
  }

  findAll(user: AuthUser, options?: FindAllMeetingDocOptions) {
    return FindAllMeetingDoc(this.prisma, user, options);
  }

  findOne(id: number) {
    return findOneMeetingDoc(this.prisma, id);
  }

  update(id: number, user: AuthUser, updateMeetingdocDto: UpdateMeetingdocDto) {
    return updateMeetingDoc(this.prisma, id, user, updateMeetingdocDto);
  }

  remove(id: number, user: AuthUser) {
    return removeMeetingDoc(this.prisma, id, user);
  }
}
