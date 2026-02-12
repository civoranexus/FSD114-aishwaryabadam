const express = require('express');
const router = express.Router();
const { uploadFile, uploadMultiple, deleteFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Upload routes
router.post('/', protect, uploadFile);
router.post('/multiple', protect, uploadMultiple);
router.delete('/:filename', protect, deleteFile);

// Download by partial name (helps when stored filename includes suffixes)
router.get('/download', protect, (req, res, next) => {
	// delegate to controller
	return require('../controllers/uploadController').downloadFile(req, res, next);
});

module.exports = router;