import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = (destination?: string) => ({
  storage: diskStorage({
    destination: (req, file, callback) => {
      const dir = `${process.env.UPLOAD_BASE_PATH || 'uploads'}/${destination || ''}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      callback(null, dir);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname).toLowerCase();
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    const ext = extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' || file.mimetype !== 'application/pdf') {
      return callback(
        new BadRequestException('Only PDF files (.pdf) are allowed'),
        false,
      );
    }
    callback(null, true);
  },
});
