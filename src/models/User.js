const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

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
        match: [/^[^\\s@]+@[^\\s@]+\.[^\\s@]+$/, "Email must be proper"]
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
})