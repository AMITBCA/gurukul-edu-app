const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

let googleClient;
const getGoogleClient = () => {
    if (!googleClient) {
        const clientId = process.env.GOOGLE_CLIENT_ID || '1099466808204-1q6o8evhj1peqo1uinu1p4oicu41rin6.apps.googleusercontent.com';
        if (!clientId) {
            console.error("CRITICAL ERROR: GOOGLE_CLIENT_ID is missing in environment variables!");
            throw new Error("Server configuration error: Google Client ID is missing.");
        }
        googleClient = new OAuth2Client(clientId);
        console.log("Google OAuth Client initialized successfully.");
    }
    return googleClient;
};


// Generate JWT
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'gurukul_fallback_secret_for_production_2026';
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, batchId, enrollmentNumber, parentContact } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role || 'student';

        // All users start unverified and inactive until email is verified
        const userData = {
            name,
            email,
            password: hashedPassword,
            role: userRole,
            isVerified: false,
            isActive: false
        };

        if (userRole === 'student') {
            if (batchId) userData.batchId = batchId;
            if (enrollmentNumber) userData.enrollmentNumber = enrollmentNumber;
            if (parentContact) userData.parentContact = parentContact;
        }

        const user = await User.create(userData);

        // Generate email verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save({ validateBeforeSave: false });

        const frontendUrl = process.env.FRONTEND_URL || 'https://gurukul-edu-app.onrender.com';
        const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;
        
        // Always log the URL for local testing
        console.log(`\n----- EMAIL VERIFICATION -----`);
        console.log(`User: ${user.email} | Role: ${userRole}`);
        console.log(`Verify URL: ${verifyUrl}`);
        console.log(`------------------------------\n`);

        const emailMsg = userRole === 'teacher'
            ? `Thank you for registering as a teacher on Gurukul Excellence!\n\nPlease click the link below to verify your email:\n\n${verifyUrl}\n\nAfter verification, your account will be reviewed by an admin before you can login.`
            : `Welcome to Gurukul Excellence!\n\nPlease verify your email to activate your account:\n\n${verifyUrl}\n\nAfter verification, you can login immediately.`;

        // Send email without blocking — user is created regardless
        sendEmail({
            email: user.email,
            subject: 'Gurukul Excellence - Verify Your Email',
            message: emailMsg
        }).catch(err => console.error('[EMAIL ERROR] Failed to send verification email:', err.message));

        const responseMsg = userRole === 'teacher'
            ? 'Teacher account created! Please check your email to verify your address. After verification, your account will be reviewed by admin.'
            : 'Registration successful! Please check your email and click the verification link to activate your account.';

        res.status(201).json({ message: responseMsg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        console.log(`[VERIFY] Verification attempt for token starting with: ${req.params.token.substring(0, 10)}...`);
        
        // Get hashed token
        const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        
        const user = await User.findOne({
            verificationToken,
            verificationTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            console.warn(`[VERIFY] Failed: Token invalid or expired`);
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        console.log(`[VERIFY] Success: Verified user ${user.email} (role: ${user.role})`);
        
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;

        // Students are activated immediately after email verification
        // Teachers remain inactive and need admin approval
        if (user.role === 'student') {
            user.isActive = true;
        }

        await user.save();

        const message = user.role === 'teacher'
            ? 'Email verified successfully! Your teacher account is now pending admin approval. You will be notified once approved.'
            : 'Email verified successfully! Your account is now active. You can login.';

        res.status(200).json({ message, role: user.role });
    } catch (error) {
        console.error(`[VERIFY] Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            
            // Advanced Auth Check
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email to login' });
            }

            if (!user.isActive) {
                return res.status(403).json({ message: 'Your account has been suspended. Please contact admin.' });
            }

            const token = generateToken(user._id);

            // Session Tracking
            const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
            const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown IP';
            
            user.sessions.push({
                token,
                device: deviceInfo,
                ip: ipAddress,
                createdAt: Date.now()
            });
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                isVerified: user.isVerified,
                isActive: user.isActive,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user & Clear Session
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        const user = await User.findById(req.user.id);
        if (user) {
            // Remove the current token from sessions
            user.sessions = user.sessions.filter(session => session.token !== token);
            await user.save();
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash and set to user
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const frontendUrl = process.env.FRONTEND_URL || 'https://gurukul-edu-app.onrender.com';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\n\nPlease make a PUT request to: \n\n ${resetUrl}`;

        // For local testing, print the URL
        console.log(`\n\n---------------------------------`);
        console.log(`[TESTING] Password Reset URL for ${user.email}:`);
        console.log(resetUrl);
        console.log(`---------------------------------\n\n`);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Gurukul Excellence - Password Reset Token',
                message
            });
            res.status(200).json({ message: 'Email sent' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        // Terminate all current sessions for security
        user.sessions = [];
        
        await user.save();

        res.status(200).json({ message: 'Password reset successful. Please login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('batchId', 'name');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google OAuth Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        console.log("--- Google Auth Debug Start ---");
        console.log("Environment GOOGLE_CLIENT_ID present:", !!process.env.GOOGLE_CLIENT_ID);
        console.log("idToken received:", idToken ? `${idToken.substring(0, 10)}... (length: ${idToken.length})` : "MISSING");
        
        if (!idToken) {
            return res.status(400).json({ message: 'Google ID Token is missing' });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID || '1099466808204-1q6o8evhj1peqo1uinu1p4oicu41rin6.apps.googleusercontent.com';
        const client = getGoogleClient();
        console.log("Verifying ID Token with audience:", clientId);
        
        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken,
                audience: clientId,
            });
            console.log("ID Token verified successfully.");
        } catch (verifyError) {
            console.error("Token verification failed:", verifyError.message);
            return res.status(401).json({ 
                message: 'Google token verification failed', 
                detail: verifyError.message 
            });
        }

        const payload = ticket.getPayload();
        const { name, email, picture, email_verified } = payload;
        console.log("User payload extracted for email:", email);

        if (!email_verified) {
            return res.status(401).json({ message: 'Google email is not verified.' });
        }

        // Check Database Connection with better messaging
        if (mongoose.connection.readyState !== 1) {
            console.error("Database not ready. readyState:", mongoose.connection.readyState);
            // Suggesting a retry if it's currently connecting (readyState 2)
            const status = mongoose.connection.readyState === 2 ? "connecting" : "disconnected";
            return res.status(503).json({ 
                message: `Database is currently ${status}. Please refresh and try again in a few seconds.`,
                retryAfter: 5
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            console.log("Blocking Google login for non-existent user:", email);
            return res.status(404).json({ 
                message: 'Account not found. Please register an account first using your email.',
                isNewUser: true 
            });
        } else if (!user.isVerified) {
            // Auto-verify if they login with Google
            user.isVerified = true;
            await user.save();
            console.log("Existing account verified via Google login.");
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account has been suspended. Please contact admin.' });
        }

        const token = generateToken(user._id);

        const deviceInfo = req.headers['user-agent'] || 'Unknown Device (Google Login)';
        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown IP';
        
        user.sessions.push({
            token,
            device: deviceInfo,
            ip: ipAddress,
            createdAt: Date.now()
        });
        await user.save();

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: picture || user.profilePicture,
            isVerified: user.isVerified,
            isActive: user.isActive,
            token
        });

    } catch (error) {
        console.error("CRITICAL: Google Auth Global Failure:", error);
        res.status(500).json({ 
            message: `Google Auth failed: ${error.message}`, 
            stack: error.stack 
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        if (req.body.profilePicture) {
            user.profilePicture = req.body.profilePicture;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
            isVerified: updatedUser.isVerified,
            isActive: updatedUser.isActive,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    googleLogin,
    logoutUser,
    forgotPassword,
    resetPassword,
    getMe,
    updateProfile,
};
