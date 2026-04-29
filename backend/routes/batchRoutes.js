const express = require('express');
const router = express.Router();
const { 
    createBatch, 
    getBatches, 
    updateBatch, 
    deleteBatch, 
    enrollStudent,
    getBatchStudents
} = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all batches is accessible by any authenticated user
router.get('/', protect, getBatches);

// Other routes are admin only
router.post('/', protect, authorize('admin'), createBatch);
router.put('/:id', protect, authorize('admin'), updateBatch);
router.delete('/:id', protect, authorize('admin'), deleteBatch);
router.post('/:id/enroll', protect, authorize('admin'), enrollStudent);
router.get('/:id/students', protect, authorize('admin', 'teacher'), getBatchStudents);

module.exports = router;
