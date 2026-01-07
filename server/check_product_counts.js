const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const checkProducts = async () => {
    await connectDB();

    try {
        const total = await Product.countDocuments();
        const verified = await Product.countDocuments({ isVerified: true });
        const unverified = await Product.countDocuments({ isVerified: false });

        console.log(`Total Products: ${total}`);
        console.log(`Verified Products: ${verified}`);
        console.log(`Unverified Products: ${unverified}`);

        if (verified > 0) {
            const sample = await Product.findOne({ isVerified: true }).select('name ecoScore isVerified');
            console.log('Sample Verified:', sample);
        }

        if (unverified > 0) {
            const sample = await Product.findOne({ isVerified: false }).select('name ecoScore isVerified');
            console.log('Sample Unverified:', sample);
        }

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

checkProducts();
