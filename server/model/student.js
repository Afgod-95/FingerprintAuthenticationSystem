const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
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
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    studentID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    faculty: {
        type: String,
        required: true,
    },
    program: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true
    },
    yearOfEnrollment: {
        type: Date,
        required: true
    },
    fingerPrintData: {
        type: Boolean,
        default: false
    },
    fingerprint: {
        type: String,
    },
    token: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

studentSchema.pre('save', async function (next) {
    if (!this.isModified('image.name')) {
        return next();
    }
    const uniqueId = Date.now().toString(); // Unique identifier (you can use UUID or any other method)
    this.image.name = `${this.image.name}-${uniqueId}`;
    next();
});

const studentData = mongoose.model('studentData', studentSchema)
module.exports = studentData