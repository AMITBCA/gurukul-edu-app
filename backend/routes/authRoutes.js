const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    googleLogin,
    verifyEmail,
    logoutUser,
    forgotPassword,
    resetPassword,
    getMe,
    updateProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/logout', protect, logoutUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
