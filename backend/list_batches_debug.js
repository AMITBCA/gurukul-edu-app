const mongoose = require('mongoose');
const Batch = require('./models/Batch');
const User = require('./models/User');
require('dotenv').config();

const listBatches = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const batches = await Batch.find({}).populate('teachers', 'name email role');
        console.log('\n--- Batches ---');
        batches.forEach(b => {
            console.log(`Name: ${b.name}`);
            console.log(`Teachers: ${b.teachers.map(t => `${t.name} (${t.email}) [${t.role}]`).join(', ')}`);
            console.log(`Students Count: ${b.students.length}`);
            console.log('---');
        });

        const teachers = await User.find({ role: 'teacher' });
        console.log('\n--- All Teachers ---');
        teachers.forEach(t => {
            console.log(`Name: ${t.name}, Email: ${t.email}`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listBatches();
