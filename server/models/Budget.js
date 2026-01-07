const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    category: {
        type: String,
        required: true,
    },
    limit: {
        type: Number,
        required: true,
    },
    period: {
        type: String,
        enum: ['MONTHLY', 'WEEKLY'],
        default: 'MONTHLY',
    },
    alertThreshold: {
        type: Number,
        default: 0.8, // Alert at 80% usage
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Budget', budgetSchema);
