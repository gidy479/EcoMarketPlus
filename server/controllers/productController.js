const Product = require('../models/Product');
const { analyzeProduct } = require('../utils/aiService');
const { analyzeSustainability } = require('../utils/sustainabilityScorer');
const { generateProducts } = require('../data/seeder_factory');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 12; // Increased distinct items visible per page
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller/Admin
const createProduct = async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock, ecoCredentials } = req.body;

        // Run AI Verification
        const { isVerified, ecoScore, verificationReport } = await analyzeProduct(description, ecoCredentials);

        const product = new Product({
            name,
            price,
            description,
            image,
            category,
            countInStock,
            ecoScore,
            ecoCredentials,
            user: req.user._id,
            isVerified,
            verificationReport
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Import products from African Seed Factory (200 items)
// @route   POST /api/products/import
// @access  Private/Admin
const importExternalProducts = async (req, res) => {
    console.log("Starting Import Process (African Catalog Scaling)...");
    try {
        // 1. CLEAR existing products ( Verified by User Request to fix duplicates/relevance)
        await Product.deleteMany({});
        console.log("Cleared existing catalog.");

        const importedProducts = [];
        let createdCount = 0;

        // 2. Generate Seed Data (200 items)
        const productsToImport = generateProducts(200);

        for (const extProduct of productsToImport) {
            // Run Sustainability Scorer
            const sustainabilityData = analyzeSustainability({
                title: extProduct.title,
                description: extProduct.description,
                category: extProduct.category
            });

            const newProduct = new Product({
                user: req.user._id, // Assign to Admin
                name: extProduct.title,
                image: extProduct.thumbnail,
                description: extProduct.description,
                category: extProduct.category,
                price: extProduct.price, // Seed data is already in GHS
                countInStock: extProduct.stock,
                rating: extProduct.rating,
                numReviews: Math.floor(Math.random() * 50),

                // Sustainability Fields
                ecoScore: sustainabilityData.ecoScore,
                ecoCredentials: sustainabilityData.ecoCredentials,
                verificationReport: sustainabilityData.verificationReport,
                isVerified: sustainabilityData.isVerified
            });

            const savedProduct = await newProduct.save();
            importedProducts.push({ name: savedProduct.name, score: savedProduct.ecoScore });
            createdCount++;
        }

        res.status(201).json({
            message: `Catalog Refreshed! Imported ${createdCount} African products.`,
            products: importedProducts
        });

    } catch (error) {
        console.error("Import Error:", error);
        res.status(500).json({ message: 'Import failed', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    importExternalProducts
};
