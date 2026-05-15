import { PrismaService } from '../../../prisma/prisma.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export async function removeMeetingDoc(prisma: PrismaService, id: number) {
  const meeting = await prisma.meetingDoc.findUnique({
    where: { id },
  });
  if (!meeting) throw new NotFoundException('Meeting not found');

  if (meeting.docfile) {
    const filePath = path.resolve(
      process.env.UPLOAD_BASE_PATH || '',
      'document',
      meeting.docfile,
    );

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
          }
        });
      }
    });
  }

  await prisma.$transaction([
    // ✅ ลบ DetailDocAssign ก่อน
    prisma.detailDocAssign.deleteMany({
      where: {
        detailDoc: {
          meetingDocId: id,
        },
      },
    }),

    // ✅ ลบ DetailDoc
    prisma.detailDoc.deleteMany({
      where: { meetingDocId: id },
    }),

    // ✅ ลบ Assign
    prisma.assign.deleteMany({
      where: { meetingDocId: id },
    }),

    // ✅ ลบ MeetingDoc
    prisma.meetingDoc.delete({
      where: { id },
    }),
  ]);

  return {
    statusCode: HttpStatus.OK,
    message: 'meetingdoc deleted successfully',
  };
}
