const express = require('express');
const router = express.Router();
const { getStudentDashboardData } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('student'), getStudentDashboardData);

module.exports = router;
