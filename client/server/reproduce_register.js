const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const testRegistration = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const randomEmail = `test_${Date.now()}@example.com`;

        // Attempt to create a user without phoneNumber
        await User.create({
            name: 'Test Duplicate',
            email: randomEmail,
            password: 'password123',
            role: 'consumer'
        });

        console.log('User created successfully');
    } catch (error) {
        console.error('Registration failed:', error.message);
        if (error.code === 11000) {
            console.error('Duplicate key error details:', error.keyPattern);
        }
    } finally {
        await mongoose.disconnect();
    }
};

testRegistration();
