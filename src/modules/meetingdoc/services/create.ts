import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { CreateMeetingdocDto } from '../dto/create-meetingdoc.dto';
import * as fs from 'fs';
import * as path from 'path';

export async function createMeetingDoc(
  prisma: PrismaService,
  user: AuthUser,
  createMeetingdocDto: CreateMeetingdocDto,
  Docfilename: string,
) {
  try {
    return await prisma.meetingDoc.create({
      data: {
        ...createMeetingdocDto,
        startDate: new Date(createMeetingdocDto.startDate),
        endDate: new Date(createMeetingdocDto.endDate),
        startTime: createMeetingdocDto.startTime,
        endTime: createMeetingdocDto.endTime,
        docfile: Docfilename,
        createdById: user.id,
      },
    });
  } catch (error) {
    if (Docfilename) {
      const filePath = path.resolve(
        process.env.UPLOAD_BASE_PATH || '',
        'document',
        Docfilename,
      );

      try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        await fs.promises.unlink(filePath);
      } catch (fsError) {
        console.error('Error deleting uploaded icon:', fsError);
      }
    }
    throw error;
  }
}
