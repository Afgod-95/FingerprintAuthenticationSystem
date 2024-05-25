const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
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


const studentData = mongoose.model('studentData', studentSchema)
module.exports = studentData