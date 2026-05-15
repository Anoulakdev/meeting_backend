import { PrismaService } from '../../../prisma/prisma.service';
// import { AuthUser } from '../../../interfaces/auth-user.interface';
import { UpdateMeetingdocDto } from '../dto/update-meetingdoc.dto';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export async function updateMeetingDoc(
  prisma: PrismaService,
  id: number,
  updateMeetingdocDto: UpdateMeetingdocDto,
) {
  const meeting = await prisma.meetingDoc.findUnique({
    where: { id },
  });
  if (!meeting) throw new NotFoundException('meeting not found');

  const oldFile = meeting.docfile || '';

  if (updateMeetingdocDto.docfile && updateMeetingdocDto.docfile !== oldFile) {
    const oldFilePath = path.resolve(
      process.env.UPLOAD_BASE_PATH || '',
      'document',
      oldFile,
    );

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่ก่อนจะลบ
    fs.access(oldFilePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error('Error deleting old icon:', err);
          }
        });
      }
    });
  } else {
    // ✅ ถ้าไม่มีรูปใหม่ ให้ใช้รูปเก่า
    updateMeetingdocDto.docfile = oldFile;
  }

  return await prisma.meetingDoc.update({
    where: { id },
    data: {
      ...updateMeetingdocDto,
      startDate: updateMeetingdocDto.startDate
        ? new Date(updateMeetingdocDto.startDate)
        : undefined,
      endDate: updateMeetingdocDto.endDate
        ? new Date(updateMeetingdocDto.endDate)
        : undefined,
      startTime: updateMeetingdocDto.startTime,
      endTime: updateMeetingdocDto.endTime,
      docfile: updateMeetingdocDto.docfile,
    },
  });
}
