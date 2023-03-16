'use strict';

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Mongodb eliminará los espacios delante y detrás del nombre
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    job: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('User', UserSchema);
