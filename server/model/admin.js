const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    image: {
        name: {
            type: String, 
            required: true, 
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
        required: true 
    },
    role: {
        type: String,
        enum: ['student', 'admin'], 
        default: 'student'
    }

}, {
    timestamps: true 
});

const adminModel = mongoose.model('adminData', adminSchema);
module.exports = adminModel;
