const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Analytics requires Admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAnalytics);

module.exports = router;
