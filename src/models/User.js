const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, "Name must be atleast 3 chars"],
        maxlength: [15, "Name must not exceed 15 chars"],
    },
    email: {
        type: String,
        required: [true, "Email must be provided"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must be proper"]
    },
    password: {
        type: String,
        required: [true, "Password must be provided"],
        minlength: [8, "Password must be atleast 8 chars"],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    plan: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    stripeCustomerId: {
        type: String,
        default: null,
        select: false,
    },
    stripeSubscriptionId: {
        type: String,
        default: null,
        select: false,
    },
    loginAttempts: {
        type: Number,
        default: 0,
        select: false,
    },
    lockUntil: {
        type: Date,
        default: null,
        select: false,
    }
}, { timestamps: true, strict: true })

// Indexing
userSchema.index({ plan: 1 })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(process.env.BCRYPT_SALT_ROUND);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
}

userSchema.methods.recordLoginFailure = async function () {
    const MAX_ATTEMPTS = 5;
    const LOCK_DURATION_MS = 15 * 60 * 1000
    this.loginAttempts += 1;

    if (this.loginAttempts >= MAX_ATTEMPTS) {
        this.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
    }

    await this.save();
}

userSchema.methods.resetLoginAttempts = async function () {
    if (this.loginAttempts !== 0 || this.lockUntil != null) {
        this.loginAttempts = 0;
        this.lockUntil = null;
        await this.save();
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;