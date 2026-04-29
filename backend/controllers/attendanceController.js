const Attendance = require('../models/Attendance');
const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Private/Teacher,Admin
exports.markAttendance = async (req, res) => {
    try {
        const { studentId, batchId, date, status } = req.body;

        // Check if student exists
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if batch exists
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Create or update attendance
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOneAndUpdate(
            { studentId, batchId, date: attendanceDate },
            { status, markedBy: req.user.id },
            { upsert: true, new: true, runValidators: true }
        );

        // Emit real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('attendance:updated', { batchId, studentId, date: attendanceDate });
        }

        // Phase 7: Automated Notification for Absentees
        if (status === 'Absent') {
            const NotificationService = require('../services/NotificationService');
            // Fire and forget (don't await to avoid blocking the response)
            NotificationService.sendAbsentAlert(student, batch.name, attendanceDate);
        }

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get attendance for a batch on a specific date
// @route   GET /api/attendance/batch/:batchId
// @access  Private/Teacher,Admin
exports.getBatchAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        const batchId = req.params.batchId;

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const attendance = await Attendance.find({ 
            batchId, 
            date: attendanceDate 
        }).populate('studentId', 'name email enrollmentNumber');

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get student's own attendance
// @route   GET /api/attendance/me
// @access  Private/Student
exports.getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ 
            studentId: req.user.id 
        }).populate('batchId', 'name').sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get attendance stats for a student
// @route   GET /api/attendance/stats/:studentId
// @access  Private/Teacher,Admin,Student
exports.getStudentAttendanceStats = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.user.id;

        const totalDays = await Attendance.countDocuments({ studentId });
        const presentDays = await Attendance.countDocuments({ studentId, status: 'Present' });
        const absentDays = await Attendance.countDocuments({ studentId, status: 'Absent' });
        const lateDays = await Attendance.countDocuments({ studentId, status: 'Late' });

        const percentage = totalDays > 0 ? ((presentDays + lateDays * 0.5) / totalDays) * 100 : 0;

        res.json({
            totalDays,
            presentDays,
            absentDays,
            lateDays,
            percentage: percentage.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Get all attendance records (Admin only)
// @route   GET /api/attendance/all
// @access  Private/Admin
exports.getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({})
            .populate('studentId', 'name email enrollmentNumber')
            .populate('batchId', 'name')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
