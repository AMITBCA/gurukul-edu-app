const Batch = require('../models/Batch');
const Material = require('../models/Material');
const Test = require('../models/Test');
const User = require('../models/User');

// @desc    Get stats for a teacher
// @route   GET /api/teacher/stats
// @access  Private/Teacher
exports.getTeacherStats = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // 1. My Batches
        const batches = await Batch.find({ teachers: teacherId });
        const batchCount = batches.length;

        // 2. Total Students (Unique students across all my batches)
        const studentIds = new Set();
        batches.forEach(batch => {
            batch.students.forEach(id => studentIds.add(id.toString()));
        });
        const studentCount = studentIds.size;

        // 3. Materials Uploaded
        const materialCount = await Material.countDocuments({ teacherId });

        // 4. Tests Conducted
        const testCount = await Test.countDocuments({ teacherId });

        res.json({
            batchCount,
            studentCount,
            materialCount,
            testCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get batches for a teacher
// @route   GET /api/teacher/batches
// @access  Private/Teacher
exports.getMyBatches = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const batches = await Batch.find({ teachers: teacherId }).populate('students', 'name email');
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
