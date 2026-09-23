import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import {
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export async function removeRelatedDoc(
  prisma: PrismaService,
  id: number,
  user: AuthUser,
) {
  const related = await prisma.relatedDoc.findUnique({
    where: { id },
  });
  if (!related) throw new NotFoundException('Related document not found');

  if (related.createdById !== user.id) {
    throw new ForbiddenException(
      'You do not have permission to delete this document',
    );
  }

  // ✅ 1. ลบข้อมูลในฐานข้อมูลให้สำเร็จใน Transaction ก่อน
  await prisma.$transaction([
    // ลบ Assign
    prisma.relatedAssign.deleteMany({
      where: { relatedDocId: id },
    }),

    // ลบ MeetingDoc
    prisma.relatedDoc.delete({
      where: { id },
    }),
  ]);

  // ✅ 2. ลบไฟล์จริงออกจากดิสก์หลังจาก Database Transaction สำเร็จแล้วเท่านั้น
  if (related.docfile) {
    const filePath = path.resolve(
      process.env.UPLOAD_BASE_PATH || '',
      'document',
      related.docfile,
    );

    fs.promises.unlink(filePath).catch((err) => {
      console.error('Error deleting document file:', err);
    });
  }

  return {
    statusCode: HttpStatus.OK,
    message: 'relateddoc deleted successfully',
  };
}
