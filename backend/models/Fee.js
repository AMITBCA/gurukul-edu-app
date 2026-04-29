const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'],
        default: 'Cash'
    },
    transactionId: {
        type: String
    },
    remarks: {
        type: String
    }
});

const feeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue'],
        default: 'Pending'
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentHistory: [paymentHistorySchema],
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Pre-save hook to automatically update status based on amountPaid and totalAmount
feeSchema.pre('save', function () {
    if (this.amountPaid >= this.totalAmount) {
        this.status = 'Paid';
    } else if (this.amountPaid > 0) {
        this.status = 'Pending'; // It could also be 'Partially Paid' but we stick to Pending for simplicity
    }
    
    // Check if overdue
    if (this.status !== 'Paid' && new Date() > this.dueDate) {
        this.status = 'Overdue';
    }
});

module.exports = mongoose.model('Fee', feeSchema);
