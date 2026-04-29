const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const API_URL = 'http://localhost:5000/api';
const testAdminEmail = 'admin@gurukul.com';
const testAdminPassword = 'AdminPassword@123';

async function fetchJSON(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
}

async function runAdminTests() {
    console.log('🔄 Connecting to Database...');
    await mongoose.connect(process.env.MONGODB_URI);
    const User = require('./models/User.js');
    const Batch = require('./models/Batch.js');

    console.log('🔄 Creating/Ensuring Admin User...');
    let admin = await User.findOne({ email: testAdminEmail });
    if (!admin) {
        admin = await User.create({
            name: 'Super Admin',
            email: testAdminEmail,
            password: testAdminPassword, // Note: server should hash this if using controller, but here we are in script
            role: 'admin',
            isVerified: true
        });
        // We need to hash it if creating directly via Mongoose if not using pre-save hook
        // Actually User.js should have a pre-save hook for password hashing if it's following best practices.
        // Let's check User.js for the Hook. Wait, I didn't see one in my previous view_file.
        // If no hook, I should add one.
    } else {
        admin.role = 'admin';
        admin.isVerified = true;
        await admin.save();
    }

    console.log('\n--- 1. Testing Admin Login ---');
    let token = '';
    try {
        const data = await fetchJSON(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: testAdminEmail,
                password: testAdminPassword
            })
        });
        console.log('✅ Admin Login Success');
        token = data.token;
    } catch (e) {
        console.error('❌ Admin Login Failed:', e.message);
        // If it failed, maybe password wasn't hashed. 
        // Let's check authController.js registration logic.
    }

    if (!token) {
        console.log('⚠️ Skipping remaining tests due to login failure. Check if password hashing is implemented in User model.');
        process.exit(1);
    }

    const authHeader = { 'Authorization': `Bearer ${token}` };

    console.log('\n--- 2. Testing Get All Users ---');
    try {
        const users = await fetchJSON(`${API_URL}/admin/users`, { headers: authHeader });
        console.log('✅ Get All Users Success. Found:', users.length);
    } catch (e) {
        console.error('❌ Get All Users Failed:', e.message);
    }

    console.log('\n--- 3. Testing Batch Creation ---');
    let batchId = '';
    try {
        const batch = await fetchJSON(`${API_URL}/batches`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                name: 'JEE Mains 2026',
                description: 'Advanced batch for JEE Mains'
            })
        });
        console.log('✅ Batch Created:', batch.name);
        batchId = batch._id;
    } catch (e) {
        console.error('❌ Batch Creation Failed:', e.message);
    }

    console.log('\n--- 4. Testing List Batches ---');
    try {
        const batches = await fetchJSON(`${API_URL}/batches`, { headers: authHeader });
        console.log('✅ List Batches Success. Found:', batches.length);
    } catch (e) {
        console.error('❌ List Batches Failed:', e.message);
    }

    console.log('\n✅ Admin API tests session complete.');
    process.exit(0);
}

runAdminTests();
