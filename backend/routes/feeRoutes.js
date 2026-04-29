const express = require('express');
const router = express.Router();
const {
    assignFee,
    getAllFees,
    getMyFees,
    recordPayment,
    generateReceipt
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), assignFee);
router.get('/', protect, authorize('admin'), getAllFees);
router.get('/myfees', protect, authorize('student'), getMyFees);
router.put('/:id/pay', protect, authorize('admin'), recordPayment);
router.get('/:id/receipt/:transactionId', protect, generateReceipt);

module.exports = router;
