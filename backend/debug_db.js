const mongoose = require('mongoose');
const Fee = require('./models/Fee');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    try {
        const fee = new Fee({
            studentId: new mongoose.Types.ObjectId(),
            batchId: new mongoose.Types.ObjectId(),
            totalAmount: 10000,
            dueDate: new Date('2026-03-20'),
            assignedBy: new mongoose.Types.ObjectId()
        });

        // Test validation
        await fee.validate();
        console.log('Validation passed!');
        
        // Test save
        await fee.save();
        console.log('Saved successfully!');
    } catch (err) {
        console.error('Validation/Save Error:', err.message || err);
    } finally {
        mongoose.disconnect();
    }
}).catch(console.error);
