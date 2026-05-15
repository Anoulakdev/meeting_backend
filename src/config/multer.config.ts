import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = (destination?: string) => ({
  storage: diskStorage({
    destination: `${process.env.UPLOAD_BASE_PATH}/${destination}`,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
});
