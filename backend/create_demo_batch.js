const mongoose = require('mongoose');
const User = require('./models/User');
const Batch = require('./models/Batch');
require('dotenv').config();

const createDemoBatch = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const teacher = await User.findOne({ email: 'doyoke7358@indevgo.com' });
        if (!teacher) {
            console.error('Teacher not found');
            process.exit(1);
        }

        const students = await User.find({ role: 'student' });
        const studentIds = students.map(s => s._id);

        const batchData = {
            name: 'JEE Excellence 2026',
            description: 'Advanced Physics and Mathematics cohort for JEE Mains/Advanced 2026.',
            teachers: [teacher._id],
            students: studentIds,
            status: 'active'
        };

        const batch = await Batch.create(batchData);
        console.log(`Successfully created batch: ${batch.name} (ID: ${batch._id})`);

        // Update students with the new batchId
        await User.updateMany(
            { _id: { $in: studentIds } },
            { batchId: batch._id }
        );
        console.log(`Enrolled ${studentIds.length} students into the batch.`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createDemoBatch();
