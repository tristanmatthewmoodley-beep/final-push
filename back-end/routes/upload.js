import express from 'express';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Private/Admin
router.post('/single', authenticate, requireAdmin, (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return file information
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: `/uploads/products/${req.file.filename}`,
        mimetype: req.file.mimetype
      }
    });
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', authenticate, requireAdmin, (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Return files information
    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/products/${file.filename}`,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: `${files.length} images uploaded successfully`,
      data: {
        files,
        count: files.length
      }
    });
  });
});

// @desc    Delete uploaded image
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
router.delete('/:filename', authenticate, requireAdmin, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `uploads/products/${filename}`;

    // Check if file exists
    const fs = await import('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image'
    });
  }
});

export default router;
