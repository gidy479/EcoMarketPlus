const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0.0,
    },
    currency: {
        type: String,
        required: true,
        default: 'GHS', // Ghanaian Cedi
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Wallet', walletSchema);
