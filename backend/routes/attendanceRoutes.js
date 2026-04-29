const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getBatchAttendance,
    getMyAttendance,
    getStudentAttendanceStats,
    getAllAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('teacher', 'admin'), markAttendance);
router.get('/batch/:batchId', protect, authorize('teacher', 'admin'), getBatchAttendance);
router.get('/all', protect, authorize('admin'), getAllAttendance);
router.get('/me', protect, authorize('student'), getMyAttendance);
router.get('/stats', protect, getStudentAttendanceStats);
router.get('/stats/:studentId', protect, getStudentAttendanceStats);

module.exports = router;
