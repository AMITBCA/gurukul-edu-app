const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    testName: {
        type: String,
        required: true,
        trim: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    results: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        marksObtained: {
            type: Number,
            required: true
        },
        feedback: {
            type: String,
            trim: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Test', testSchema);
