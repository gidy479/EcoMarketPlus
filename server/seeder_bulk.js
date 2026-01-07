const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const categories = ['Home', 'Tech', 'Fashion', 'Beauty', 'Food', 'Office', 'Travel'];
const sampleImages = {
    'Home': [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', // Blender - Kitchen
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800', // Sofa
        'https://images.unsplash.com/photo-1595160867761-12c8225e0431?w=800', // Lamp
    ],
    'Tech': [
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800', // Laptop
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', // Headphones
        'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800', // Monitor
    ],
    'Fashion': [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800', // T-Shirt
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', // Shoes
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', // Bag
    ],
    'Beauty': [
        'https://images.unsplash.com/photo-1571781257850-252f8615822e?w=800', // Cream
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', // Serum
    ],
    'Food': [
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', // Salad
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800', // Ice cream
    ],
    'Office': [
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
    ],
    'Travel': [
        'https://images.unsplash.com/photo-1565514020176-78f244585cf2?w=800',
    ]
};

const getRandomImage = (category) => {
    const images = sampleImages[category] || sampleImages['Home'];
    return images[Math.floor(Math.random() * images.length)];
};

const generateProducts = (userStartId) => {
    const products = [];
    for (let i = 1; i <= 200; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const ecoScore = Math.floor(Math.random() * (100 - 70 + 1) + 70); // 70-100
        const price = Math.floor(Math.random() * (500 - 20 + 1) + 20); // 20-500 GHS

        products.push({
            user: userStartId,
            name: `${category} Eco Product ${i} - Sustainable Choice`,
            image: getRandomImage(category),
            description: `This is a high-quality ${category} product (Item ${i}). Made with 100% sustainable materials, verified for low carbon footprint.`,
            category: category,
            price: price,
            countInStock: Math.floor(Math.random() * 100),
            ecoScore: ecoScore,
            ecoCredentials: {
                materials: 'Recycled / Organic',
                productionMethod: 'Carbon Neutral',
                certification: 'Global Eco Label'
            },
            isVerified: true
        });
    }
    return products;
};

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
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

        const sellerUser = createdUsers[1]._id;

        const products = generateProducts(sellerUser);
        await Product.insertMany(products);

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
