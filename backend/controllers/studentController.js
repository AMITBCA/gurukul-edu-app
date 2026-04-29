const Material = require('../models/Material');
const Test = require('../models/Test');
const User = require('../models/User');

// @desc    Get dashboard data for students (latest materials & tests)
// @route   GET /api/student/dashboard
// @access  Private/Student
exports.getStudentDashboardData = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        
        if (!student.batchId) {
            return res.json({
                latestMaterial: null,
                upcomingTest: null,
                message: 'No batch assigned yet.'
            });
        }

        // Fetch latest material for the student's batch
        const latestMaterial = await Material.findOne({ batchId: student.batchId })
            .sort({ createdAt: -1 })
            .populate('teacherId', 'name');

        // Fetch latest/upcoming test for the student's batch
        const latestTest = await Test.findOne({ batchId: student.batchId })
            .sort({ date: -1 })
            .populate('teacherId', 'name');

        res.json({
            latestMaterial,
            latestTest,
            batchId: student.batchId
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
