const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    ecoScore: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100,
    },
    ecoCredentials: {
        materials: String,
        productionMethod: String,
        certification: String,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    verificationReport: [String],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
