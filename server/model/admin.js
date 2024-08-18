const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    image: {
        name: {
            type: String, 
            required: true, 
            unique: true
        },
        data: {
            type: Buffer, 
            required: true
        },
        contentType: {
            type: String, 
            required: true
        },
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true // Fixed typo: 'requird' -> 'required'
    },
    token: {
        type: String,
    }
}, {
    timestamps: true 
});

const adminModel = mongoose.model('admin', adminSchema);
module.exports = adminModel;
