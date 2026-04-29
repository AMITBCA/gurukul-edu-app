const User = require('../models/User');
const Batch = require('../models/Batch');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }
        const users = await User.find(filter).populate('batchId', 'name').sort('-createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['admin', 'teacher', 'student'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).sort('-createdAt');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new teacher
// @route   POST /api/admin/teachers
// @access  Private/Admin
exports.createTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const teacher = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'teacher',
            isVerified: true, // Admin created accounts are auto-verified
            isActive: true
        });

        res.status(201).json({
            message: 'Teacher created successfully',
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Toggle teacher status (Approve/Suspend)
// @route   PUT /api/admin/teachers/:id/status
// @access  Private/Admin
exports.toggleTeacherStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ 
            message: `Teacher ${user.isActive ? 'activated' : 'suspended'} successfully`, 
            teacher: user 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const teacherCount = await User.countDocuments({ role: 'teacher' });
        const batchCount = await Batch.countDocuments({});
        
        // Count teachers who verified their email but are awaiting admin approval
        const pendingTeachers = await User.countDocuments({ role: 'teacher', isVerified: true, isActive: false });

        res.json({
            studentCount,
            teacherCount,
            batchCount,
            pendingTeachers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Toggle User Status (Verify/Disable/Enable)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // Guard: Prevent deactivating the last admin or yourself
        if (user.role === 'admin' && user.isActive) {
            // Check if this is the only active admin
            const activeAdmins = await User.countDocuments({ role: 'admin', isActive: true });
            if (activeAdmins <= 1 && user._id.toString() === req.params.id) {
                 return res.status(400).json({ message: 'Safety Guard: Cannot deactivate the only active Admin account.' });
            }
            
            // Prevent self-deactivation (even if there are other admins, it's safer to avoid accidents)
            if (req.user.id === req.params.id) {
                return res.status(400).json({ message: 'Safety Guard: Cannot deactivate your own Admin account. Ask another admin to do this.' });
            }
        }

        // If user is not verified, verify them first
        if (!user.isVerified) {
            user.isVerified = true;
            user.isActive = true; // Ensure they are active when first verified
        } else {
            // If already verified, toggle their active status
            user.isActive = !user.isActive;
        }

        await user.save();

        res.json({ 
            message: `User ${user.isVerified ? 'verified' : ''} ${user.isActive ? 'activated' : 'suspended'} successfully`, 
            user 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
