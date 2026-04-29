const Fee = require('../models/Fee');
const User = require('../models/User');
const Batch = require('../models/Batch');
const { generateFeeReceipt } = require('../utils/pdfGenerator');

// @desc    Assign fee to a student
// @route   POST /api/fees
// @access  Admin
exports.assignFee = async (req, res) => {
    try {
        const { studentId, batchId, totalAmount, dueDate } = req.body;

        if (!studentId || !batchId || !totalAmount || !dueDate) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const fee = await Fee.create({
            studentId,
            batchId,
            totalAmount,
            dueDate,
            assignedBy: req.user.id
        });

        // Phase 7: Send Fee Assigned Email (Fire and forget)
        const student = await User.findById(studentId);
        const batch = await Batch.findById(batchId);
        if (student && batch) {
            const notificationService = require('../utils/notificationService');
            notificationService.sendFeeAssignedAlert(student, totalAmount, dueDate, batch.name);
        }

        res.status(201).json({
            success: true,
            data: fee
        });
    } catch (error) {
        console.error('Assign Fee Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all fees
// @route   GET /api/fees
// @access  Admin
exports.getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find()
            .populate('studentId', 'name email enrollmentNumber')
            .populate('batchId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: fees.length,
            data: fees
        });
    } catch (error) {
        console.error('Get All Fees Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get logged in student's fees
// @route   GET /api/fees/myfees
// @access  Student
exports.getMyFees = async (req, res) => {
    try {
        const fees = await Fee.find({ studentId: req.user.id })
            .populate('batchId', 'name')
            .sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            count: fees.length,
            data: fees
        });
    } catch (error) {
        console.error('Get My Fees Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Record a payment
// @route   PUT /api/fees/:id/pay
// @access  Admin
exports.recordPayment = async (req, res) => {
    try {
        const { amount, paymentMethod, transactionId, remarks } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Please provide payment amount' });
        }

        let fee = await Fee.findById(req.params.id);

        if (!fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }

        fee.amountPaid += Number(amount);
        
        // Add to payment history
        fee.paymentHistory.push({
            amount: Number(amount),
            paymentMethod,
            transactionId,
            remarks
        });

        // The pre-save hook in the Fee model will update the status automatically
        await fee.save();

        res.status(200).json({
            success: true,
            data: fee
        });
    } catch (error) {
        console.error('Record Payment Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Generate and download fee receipt
// @route   GET /api/fees/:id/receipt/:transactionId
// @access  Private (Admin or the specific Student)
exports.generateReceipt = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id)
            .populate('studentId', 'name email enrollmentNumber')
            .populate('batchId', 'name');

        if (!fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }

        // Authorization check: User must be admin OR the student owning this fee
        if (req.user.role !== 'admin' && fee.studentId._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this receipt' });
        }

        const payment = fee.paymentHistory.id(req.params.transactionId);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment transaction not found' });
        }

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Receipt-${payment._id.toString().slice(-6)}.pdf`);

        // Generate PDF
        generateFeeReceipt(res, fee, payment, fee.studentId);

    } catch (error) {
        console.error('Generate Receipt Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

