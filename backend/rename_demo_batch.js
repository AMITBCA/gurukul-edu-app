const mongoose = require('mongoose');
const Batch = require('./models/Batch');
require('dotenv').config();

const renameBatch = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const filter = { name: 'JEE Excellence 2026' };
        const update = { name: 'Demo Batch - JEE 2026' };

        const batch = await Batch.findOneAndUpdate(filter, update, { new: true });
        if (batch) {
            console.log(`Successfully renamed batch to: ${batch.name}`);
        } else {
            console.log('Batch "JEE Excellence 2026" not found.');
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

renameBatch();
