const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
    profilePic: {
        type: Buffer,   
        required: true,
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
        type: Number,
        required: true
    },
    yearOfEnrollment: {
        type: Number,
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