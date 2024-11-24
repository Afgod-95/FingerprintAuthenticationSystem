const mongoose = require('mongoose')
const attendanceModel = new mongoose.Schema({
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
        required: true,
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
    yearOfCompletion: {
        type: Date,
        required: true
    },
    fingerPrintData: {
        type: Buffer,
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent"],
        default: 'Absent'
    },
    seatNumber: {
        type: String, 
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
})




const studentModel = mongoose.model('studentData', attendanceModel)
module.exports = studentModel