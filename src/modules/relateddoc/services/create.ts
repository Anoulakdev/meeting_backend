import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { CreateRelateddocDto } from '../dto/create-relateddoc.dto';
import * as fs from 'fs';
import * as path from 'path';

export async function createRelatedDoc(
  prisma: PrismaService,
  user: AuthUser,
  createRelateddocDto: CreateRelateddocDto,
  Docfilename: string,
) {
  try {
    return await prisma.relatedDoc.create({
      data: {
        ...createRelateddocDto,
        departmentId: createRelateddocDto.departmentId
          ? Number(createRelateddocDto.departmentId)
          : null,
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
