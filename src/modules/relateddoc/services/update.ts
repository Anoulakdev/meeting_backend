import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { UpdateRelateddocDto } from '../dto/update-relateddoc.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export async function updateRelatedDoc(
  prisma: PrismaService,
  id: number,
  user: AuthUser,
  updateRelateddocDto: UpdateRelateddocDto,
) {
  const related = await prisma.relatedDoc.findUnique({
    where: { id },
    include: {
      relatedAssigns: true,
    },
  });
  if (!related) throw new NotFoundException('Related document not found');

  if (related.createdById !== user.id) {
    throw new ForbiddenException(
      'You do not have permission to edit this document',
    );
  }

  const oldFile = related.docfile || '';
  let shouldDeleteOldFile = false;

  if (updateRelateddocDto.docfile && updateRelateddocDto.docfile !== oldFile) {
    shouldDeleteOldFile = true;
  } else {
    updateRelateddocDto.docfile = oldFile;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedDoc = await tx.relatedDoc.update({
      where: { id },
      data: {
        ...updateRelateddocDto,
        departmentId: updateRelateddocDto.departmentId
          ? Number(updateRelateddocDto.departmentId)
          : null,
        docfile: updateRelateddocDto.docfile,
      },
    });

    return updatedDoc;
  });

  if (shouldDeleteOldFile && oldFile) {
    const oldFilePath = path.resolve(
      process.env.UPLOAD_BASE_PATH || '',
      'document',
      oldFile,
    );
    fs.promises.unlink(oldFilePath).catch((err) => {
      console.error('Error deleting old document file:', err);
    });
  }

  return updated;
}
