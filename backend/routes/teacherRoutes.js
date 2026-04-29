const express = require('express');
const router = express.Router();
const { getTeacherStats, getMyBatches } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('teacher'), getTeacherStats);
router.get('/batches', protect, authorize('teacher'), getMyBatches);

module.exports = router;
