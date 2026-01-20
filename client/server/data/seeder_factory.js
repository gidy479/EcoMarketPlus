const adjs = [
    'Authentic', 'Handcrafted', 'Premium', 'Organic', 'Traditional',
    'Royal', 'Modern', 'Vintage', 'Recycled', 'Pure', 'Sustainable',
    'Artisan', 'Local', 'Fresh', 'Natural', 'Exotic', 'Rare', 'Classic',
    'Custom', 'Luxury'
];

const origins = [
    'Ashanti', 'Northern', 'Bolga', 'Accra', 'Kumasi', 'Volta',
    'Tamale', 'Cape Coast', 'Gold Coast', 'Savannah', 'Eastern', 'Western'
];

const categories = {
    'Fashion': {
        items: ['Kente Cloth', 'Smock (Fugu)', 'Kaftan', 'Print Dress', 'Dashiki', 'Headwrap', 'Bead Bracelet', 'Leather Sandals', 'Beaded Necklace', 'Woven Bag'],
        images: [
            'https://images.unsplash.com/photo-1598558774026-6b2c79313a89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1603539825482-1e967520e796?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ]
    },
    'Beauty': {
        items: ['Shea Butter', 'Black Soap', 'Cocoa Butter', 'Baobab Oil', 'Neem Oil', 'Coconut Oil', 'Body Scrub', 'Hair Cream'],
        images: [
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1556228720-191901b0b749?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1571781535014-53bd037d2520?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ]
    },
    'Groceries': {
        items: ['Jollof Spices', 'Tiger Nuts', 'Cocoa Powder', 'Plantain Chips', 'Shito (Pepper Sauce)', 'Dried Hibiscus', 'Millet', 'Yam', 'Palm Oil', 'Cassava Flour'],
        images: [
            'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1548842777-a8d626354af3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1563829023-7a912bb0e768?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1604544203165-4424367ef22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ]
    },
    'Home': {
        items: ['Bolga Basket', 'Wooden Stool', 'Drum (Djembe)', 'Wall Mask', 'Clay Pot', 'Hand Fan', 'Woven Mat', 'Carved Statue'],
        images: [
            'https://images.unsplash.com/photo-1549497538-cd25e018683e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1595867184205-1a87799d5006?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1584102558557-caf6871a398c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1518112390430-f4ab02e9c2c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ]
    }
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getPrice = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProducts = (count = 200) => {
    const products = [];
    const categoryKeys = Object.keys(categories);

    for (let i = 0; i < count; i++) {
        const category = getRandom(categoryKeys);
        const catData = categories[category];
        const item = getRandom(catData.items);
        const origin = getRandom(origins);
        const adj = getRandom(adjs);
        const image = getRandom(catData.images);

        products.push({
            title: `${adj} ${origin} ${item}`,
            price: getPrice(20, 800),
            description: `Experience the quality of this ${adj.toLowerCase()} ${item.toLowerCase()} sourced directly from ${origin}, Ghana. Perfect for daily use or as a unique gift. Supports local artisans and sustainable practices.`,
            category: category,
            stock: getPrice(10, 500),
            thumbnail: image,
            rating: (Math.random() * 2 + 3).toFixed(1) // 3.0 to 5.0
        });
    }
    return products;
};

module.exports = { generateProducts };
