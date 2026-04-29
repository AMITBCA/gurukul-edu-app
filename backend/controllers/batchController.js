const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Create a new batch
// @route   POST /api/batches
// @access  Private/Admin
exports.createBatch = async (req, res) => {
    try {
        const { name, description } = req.body;

        const batchExists = await Batch.findOne({ name });
        if (batchExists) {
            return res.status(400).json({ message: 'Batch already exists' });
        }

        const batch = await Batch.create({
            name,
            description
        });

        // Emit real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('batch:updated', { batchId: batch._id, action: 'created' });
        }

        res.status(201).json(batch);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private/Admin,Teacher,Student
exports.getBatches = async (req, res) => {
    try {
        const batches = await Batch.find({}).populate('teachers', 'name email');
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Private/Admin
exports.updateBatch = async (req, res) => {
    try {
        const { name, description, teachers, status } = req.body;

        const batch = await Batch.findById(req.params.id);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        batch.name = name || batch.name;
        batch.description = description || batch.description;
        batch.teachers = teachers || batch.teachers;
        batch.status = status || batch.status;

        await batch.save();

        // Emit real-time update
        const io = req.app.get('io');
        io.emit('batch:updated', { batchId: batch._id, action: 'updated' });

        res.json(batch);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Private/Admin
exports.deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        await batch.deleteOne();
        res.json({ message: 'Batch removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Enroll student in batch
// @route   POST /api/batches/:id/enroll
// @access  Private/Admin
exports.enrollStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const batchId = req.params.id;

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        // 1. Remove student from any previous batch
        if (student.batchId && student.batchId.toString() !== batchId) {
            const oldBatch = await Batch.findById(student.batchId);
            if (oldBatch) {
                oldBatch.students = oldBatch.students.filter(s => s.toString() !== studentId);
                await oldBatch.save();
            }
        }

        // 2. Add student to new batch if not already there
        if (!batch.students.includes(studentId)) {
            batch.students.push(studentId);
            await batch.save();
        }

        // 3. Update student's batchId
        student.batchId = batchId;
        await student.save();

        // 4. Emit real-time updates for Admin, Teacher, and Student
        const io = req.app.get('io');
        if (io) {
            io.emit('batch:updated', { batchId, studentId, action: 'enrolled' });
            // Also emit for the student specifically if needed, 
            // but the dashboard already listens to 'batch:updated'
        }

        res.json({ message: 'Student enrolled successfully', batch });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Get students in a batch
// @route   GET /api/batches/:id/students
// @access  Private/Admin,Teacher
exports.getBatchStudents = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id).populate('students', 'name email enrollmentNumber');
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }
        res.json(batch.students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
