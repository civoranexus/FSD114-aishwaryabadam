const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.body.type || 'general';
    const typeDir = path.join(uploadDir, type);
    
    // Create type-specific directory
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    
    cb(null, typeDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|avi|mov|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: images, videos, PDFs, documents'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  }
});

// @desc    Upload single file
// @route   POST /api/upload
// @access  Private
exports.uploadFile = (req, res, next) => {
  const uploadSingle = upload.single('file');
  
  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error
      return res.status(400).json({
        success: false,
        message: 'File upload error: ' + err.message
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Return file information
    const fileUrl = `/uploads/${req.body.type || 'general'}/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: fileUrl
      }
    });
  });
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultiple = (req, res, next) => {
  const uploadMultiple = upload.array('files', 10); // Max 10 files
  
  uploadMultiple(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: 'File upload error: ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${req.body.type || 'general'}/${file.filename}`
    }));
    
    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      files
    });
  });
};

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Private
exports.deleteFile = (req, res, next) => {
  try {
    const { filename } = req.params;
    const { type } = req.query;
    
    const filePath = path.join(uploadDir, type || 'general', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Delete file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

// @desc    Download file by partial name match
// @route   GET /api/upload/download?type=lesson-file&name=some-name
// @access  Private
exports.downloadFile = (req, res, next) => {
  try {
    const { type = 'general', name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Missing name query parameter' });
    }

    const typeDir = path.join(uploadDir, type);

    if (!fs.existsSync(typeDir)) {
      return res.status(404).json({ success: false, message: 'Type directory not found' });
    }

    // Find a file in the directory that includes the provided name (case-insensitive)
    const files = fs.readdirSync(typeDir);
    const decodedName = decodeURIComponent(name).toLowerCase();

    const match = files.find(f => f.toLowerCase().includes(decodedName));

    if (!match) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const filePath = path.join(typeDir, match);
    return res.sendFile(path.resolve(filePath));
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving file', error: error.message });
  }
};