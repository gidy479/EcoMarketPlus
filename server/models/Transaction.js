const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Wallet',
    },
    type: {
        type: String, // 'DEBIT' or 'CREDIT'
        required: true,
        enum: ['DEBIT', 'CREDIT'],
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String, // e.g., 'Groceries', 'Transport', 'Utilities'
        required: true,
        default: 'General',
    },
    status: {
        type: String,
        required: true,
        default: 'COMPLETED',
    },
    reference: {
        type: String, // Payment gateway ref
    },
    isEcoFriendly: {
        type: Boolean,
        default: false,
    },
    isManualEntry: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
