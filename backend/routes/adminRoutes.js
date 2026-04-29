const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    updateUserRole, 
    deleteUser, 
    getAllTeachers, 
    createTeacher,
    toggleTeacherStatus,
    getAdminStats,
    toggleUserStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/teachers', getAllTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id/status', toggleTeacherStatus);
router.get('/stats', getAdminStats);

module.exports = router;
