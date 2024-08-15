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
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
    yearOfCompletion: {
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
    status: {
        type: String,
        enum: ["Present", "Absent"],
        default: 'Absent'
    },
    seatNumber: {
        type: String, 
        unique: true
    },
    token: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

studentSchema.index({ studentID: 1 });
studentSchema.index({ email: 1 });



const studentData = mongoose.model('studentData', studentSchema)
module.exports = studentData