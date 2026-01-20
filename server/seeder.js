const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        try {
            await User.collection.dropIndex('phoneNumber_1');
            console.log('Orphaned index phoneNumber_1 dropped'.yellow);
        } catch (error) { }

        try {
            await User.collection.dropIndex('accountNumber_1');
            console.log('Orphaned index accountNumber_1 dropped'.yellow);
        } catch (error) { }

        try {
            await User.collection.dropIndex('username_1');
            console.log('Orphaned index username_1 dropped'.yellow);
        } catch (error) { }
        await Product.deleteMany();

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123', // Will be hashed by pre-save hook
                role: 'admin',
            },
            {
                name: 'Eco Seller',
                email: 'seller@example.com',
                password: 'password123',
                role: 'seller',
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password: 'password123',
                role: 'consumer',
            },
        ]);

        const adminUser = createdUsers[0]._id;
        const sellerUser = createdUsers[1]._id;

        const ONE_HOUR = 60 * 60 * 1000; // 1 hour in ms needed for timeout 

        // Fetch products from DummyJSON
        console.log('Fetching products from DummyJSON...'.cyan);
        const response = await fetch('https://dummyjson.com/products?limit=100');
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        const apiProducts = data.products;

        const sampleProducts = apiProducts.map((product) => {
            // Generate random eco-friendly attributes
            const ecoScore = Math.floor(Math.random() * (99 - 50 + 1)) + 50;
            const materialsList = ['Recycled Plastic', 'Organic Cotton', 'Bamboo', 'Glass', 'Hemp', 'Cork', 'Reclaimed Wood', 'Recycled Metal'];
            const methodsList = ['Handmade', 'Fair Trade', 'Low Energy', 'Water Efficient', 'Zero Waste', 'Carbon Neutral'];
            const certsList = ['FSC', 'GOTS', 'Fair Trade USA', 'Energy Star', 'Rainforest Alliance', 'Cradle to Cradle'];

            const randomMaterial = materialsList[Math.floor(Math.random() * materialsList.length)];
            const randomMethod = methodsList[Math.floor(Math.random() * methodsList.length)];
            const randomCert = certsList[Math.floor(Math.random() * certsList.length)];

            return {
                user: sellerUser,
                name: product.title,
                image: product.thumbnail,
                description: product.description,
                category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
                price: product.price,
                countInStock: product.stock,
                rating: product.rating,
                numReviews: Math.floor(Math.random() * 50), // Random number of reviews
                ecoScore: ecoScore,
                ecoCredentials: {
                    materials: randomMaterial,
                    productionMethod: randomMethod,
                    certification: randomCert,
                },
                isVerified: true,
            };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
