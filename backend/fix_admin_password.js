const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@gurukul.com';
        const newPassword = 'AdminPassword@123';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await User.findOneAndUpdate(
            { email },
            { 
                password: hashedPassword,
                isVerified: true,
                isActive: true,
                role: 'admin'
            },
            { new: true }
        );

        if (result) {
            console.log(`Successfully updated password for ${email}`);
            console.log('You can now login with:');
            console.log(`Email: ${email}`);
            console.log(`Password: ${newPassword}`);
        } else {
            console.log(`User ${email} not found. Creating...`);
            await User.create({
                name: 'Super Admin',
                email,
                password: hashedPassword,
                role: 'admin',
                isVerified: true,
                isActive: true
            });
            console.log(`Successfully created admin: ${email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixAdmin();
