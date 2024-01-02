import multer from 'multer';
import mime from 'mime';

console.log('MULTER');

let upload: any;
if (process.env.NODE_ENV === 'production') {
  upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
      ];

      console.log('MULTER RUNS IN PROD');

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    },
  });
} else {
  console.log('MULTER RUNS IN DEV');
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  upload = multer({
    storage: diskStorage,
    fileFilter: function (req, file, cb) {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    },
  });
}

export { upload };
