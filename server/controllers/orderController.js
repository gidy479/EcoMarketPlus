const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        // WALLET PAYMENT INTEGRATION
        let isPaid = false;
        let paidAt = null;
        let paymentResult = {};

        if (paymentMethod === 'Wallet') {
            const wallet = await Wallet.findOne({ user: req.user._id });
            if (!wallet) {
                res.status(404).json({ message: 'Wallet not found' });
                return;
            }
            if (wallet.balance < totalPrice) {
                res.status(400).json({ message: 'Insufficient wallet funds' });
                return;
            }

            // Deduct funds
            wallet.balance -= totalPrice;
            await wallet.save();

            // Create Transaction
            await Transaction.create({
                user: req.user._id,
                wallet: wallet._id,
                type: 'DEBIT',
                amount: totalPrice,
                category: 'Shopping',
                description: `Payment for Order`, // Order ID not available yet
                reference: `WAL-${Date.now()}`,
                status: 'COMPLETED',
                isEcoFriendly: false // Logic to check eco-friendliness can be added
            });

            isPaid = true;
            paidAt = Date.now();
            paymentResult = {
                id: `WAL-${Date.now()}`,
                status: 'COMPLETED',
                update_time: String(Date.now()),
                email_address: req.user.email
            };
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid,
            paidAt,
            paymentResult
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        // Ensure user is authorized to view this order
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to view this order' });
            return;
        }
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        // Payment result from Paystack/Gateway
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        // INTEGRATION: Create Transaction Record for Finance Tracker
        try {
            const wallet = await Wallet.findOne({ user: req.user._id });
            if (wallet) {
                await Transaction.create({
                    user: req.user._id,
                    wallet: wallet._id,
                    type: 'DEBIT',
                    amount: order.totalPrice,
                    category: 'Shopping', // Default category for orders
                    description: `Order #${order._id}`,
                    isEcoFriendly: false, // In a real app, calculate based on items in order
                    status: 'COMPLETED',
                    reference: req.body.id
                });
            }
        } catch (error) {
            console.error('Failed to log transaction for order:', error);
            // Don't fail the request, just log the error
        }

        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders
};
