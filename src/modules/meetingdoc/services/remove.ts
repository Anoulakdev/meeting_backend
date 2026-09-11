import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { HttpStatus, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export async function removeMeetingDoc(
  prisma: PrismaService,
  id: number,
  user: AuthUser,
) {
  const meeting = await prisma.meetingDoc.findUnique({
    where: { id },
  });
  if (!meeting) throw new NotFoundException('Meeting not found');

  if (user.roleId !== 1 && meeting.createdById !== user.id) {
    throw new ForbiddenException('You do not have permission to delete this meeting');
  }

  // ✅ 1. ลบข้อมูลในฐานข้อมูลให้สำเร็จใน Transaction ก่อน
  await prisma.$transaction([
    // ลบ DetailDocAssign ก่อน
    prisma.detailDocAssign.deleteMany({
      where: {
        detailDoc: {
          meetingDocId: id,
        },
      },
    }),

    // ลบ DetailDoc
    prisma.detailDoc.deleteMany({
      where: { meetingDocId: id },
    }),

    // ลบ Assign
    prisma.assign.deleteMany({
      where: { meetingDocId: id },
    }),

    // ลบ MeetingDoc
    prisma.meetingDoc.delete({
      where: { id },
    }),
  ]);

  // ✅ 2. ลบไฟล์จริงออกจากดิสก์หลังจาก Database Transaction สำเร็จแล้วเท่านั้น
  if (meeting.docfile) {
    const filePath = path.resolve(
      process.env.UPLOAD_BASE_PATH || '',
      'document',
      meeting.docfile,
    );

    fs.promises.unlink(filePath).catch((err) => {
      console.error('Error deleting document file:', err);
    });
  }

  return {
    statusCode: HttpStatus.OK,
    message: 'meetingdoc deleted successfully',
  };
}
