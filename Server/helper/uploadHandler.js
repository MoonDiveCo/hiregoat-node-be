import multer from 'multer';
import path from 'path';

const fs = require('fs');

export class UploadHandler {
  constructor(fileSize) {
    this.fileSize = fileSize;

    // Memory storage to keep files in memory
    this.storage = multer.memoryStorage();

    this.uploadFile = this.uploadFile.bind(this);
  }

  /**
   * Handle upload errors
   */
  handleUploadError(req, res, next, upload) {
    upload(req, res, function (err) {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          // Send a custom response for file size limit exceeded
          return res.status(400).json({
            status: 'error',
            message: 'File size limit exceeded',
            // Include any other relevant information
          });
        }
        // Handle other errors or pass them along
        return next(err);
      }
      return next();
    });
  }

  /**
   * Upload file using memory storage
   */
  uploadFile(req, res, next) {
    const upload = multer({
      storage: this.storage,
      fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png']; // Allowed extensions for image files
        if (!allowedExtensions.includes(ext)) {
          return cb(
            new Error(
              'Invalid file type. Only .jpg, .jpeg, and .png are allowed.'
            )
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 100, // Example: 100 MB
      },
    }).single('file'); // Only expecting one file

    this.handleUploadError(req, res, next, upload);
  }
}

export default new UploadHandler(10);
