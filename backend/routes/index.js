const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const batchRoutes = require('./batchRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const materialRoutes = require('./materialRoutes');
const testRoutes = require('./testRoutes');
const teacherRoutes = require('./teacherRoutes');
const studentRoutes = require('./studentRoutes');
const feeRoutes = require('./feeRoutes');

// @route   GET /api
// @desc    Test route to verify API is working
// @access  Public
router.get('/', (req, res) => {
    res.json({ message: 'Gurukul Excellence API is running smoothly!' });
});

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/batches', batchRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/materials', materialRoutes);
router.use('/tests', testRoutes);
router.use('/teacher', teacherRoutes);
router.use('/student', studentRoutes);
router.use('/fees', feeRoutes);
router.use('/analytics', require('./analyticsRoutes'));

module.exports = router;
