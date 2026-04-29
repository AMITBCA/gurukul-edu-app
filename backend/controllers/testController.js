const Test = require('../models/Test');

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private/Teacher,Admin
exports.createTest = async (req, res) => {
    try {
        const { testName, batchId, totalMarks, date } = req.body;

        const test = await Test.create({
            testName,
            batchId,
            totalMarks,
            date,
            teacherId: req.user.id
        });

        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add or update test results for students
// @route   PUT /api/tests/:id/results
// @access  Private/Teacher,Admin
exports.updateTestResults = async (req, res) => {
    try {
        const { results } = req.body;
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check authorization
        if (test.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        test.results = results;
        await test.save();

        // Phase 7: Send Test Result Emails (Fire and forget)
        const NotificationService = require('../services/NotificationService');
        const User = require('../models/User');
        
        setImmediate(async () => {
            try {
                const studentIds = results.map(r => r.studentId);
                const students = await User.find({ _id: { $in: studentIds } });
                
                for (const result of results) {
                    const student = students.find(s => s._id.toString() === result.studentId.toString());
                    if (student) {
                        await NotificationService.sendTestResultAlert(student, test.testName, result.marksObtained, test.totalMarks);
                    }
                }
            } catch (err) {
                console.error("Error sending test emails:", err);
            }
        });

        res.json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all tests for a batch
// @route   GET /api/tests/batch/:batchId
// @access  Private
exports.getBatchTests = async (req, res) => {
    try {
        const tests = await Test.find({ batchId: req.params.batchId }).sort({ date: -1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get student's results
// @route   GET /api/tests/me
// @access  Private/Student
exports.getMyResults = async (req, res) => {
    try {
        const tests = await Test.find({
            'results.studentId': req.user.id
        }).select('testName totalMarks date results.$');

        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
