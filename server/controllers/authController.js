const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    console.log(`[AUTH LOG] Attempting registration for: ${email}`);

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log(`[AUTH LOG] User already exists: ${email}`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            console.log(`[AUTH LOG] User created successfully: ${email}`);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            console.log(`[AUTH LOG] Invalid user data for: ${email}`);
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(`[AUTH LOG] Registration Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log(`[AUTH LOG] Attempting login for: ${email}`); // Debug log

    try {
        const user = await User.findOne({ email });

        if (user) {
            console.log(`[AUTH LOG] User found: ${user.email}`);
            if (await user.matchPassword(password)) {
                console.log(`[AUTH LOG] Password match for: ${email}`);
                res.json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id),
                });
            } else {
                console.log(`[AUTH LOG] Password MISMATCH for: ${email}`);
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            console.log(`[AUTH LOG] User NOT found: ${email}`);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(`[AUTH LOG] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const { credential } = req.body; // Receive JWT credential from frontend

    try {



        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const { email, name, picture, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (user) {
            // Update googleId and avatar if missing or changed
            user.googleId = googleId;
            user.avatar = picture;
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            // Create new user
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                name,
                email,
                password: randomPassword,
                googleId,
                avatar: picture,
                role: 'consumer' // Default rule
            });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        }
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ message: 'Google Authentication Failed', error: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // MOCK EMAIL SENDING
        console.log(`
        ############################################
        [MOCK EMAIL SERVICE]
        To: ${email}
        Subject: Password Reset Request
        Message: Click the link to reset your password: ${resetUrl}
        ############################################
        `);

        res.status(200).json({
            success: true,
            data: 'Email sent (checked console)',
            // EXPOSE FOR DEV TESTING
            devLink: process.env.NODE_ENV === 'development' ? resetUrl : undefined
        });
    } catch (error) {
        console.error(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, data: 'Password updated success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.avatar) {
                user.avatar = req.body.avatar;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
    googleLogin,
    forgotPassword,
    resetPassword
};
