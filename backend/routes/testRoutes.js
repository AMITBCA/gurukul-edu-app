const express = require('express');
const router = express.Router();
const {
    createTest,
    updateTestResults,
    getBatchTests,
    getMyResults
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('teacher', 'admin'), createTest);
router.put('/:id/results', protect, authorize('teacher', 'admin'), updateTestResults);
router.get('/batch/:batchId', protect, getBatchTests);
router.get('/me', protect, authorize('student'), getMyResults);

module.exports = router;
