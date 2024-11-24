const mongoose = require('mongoose')
const dbStructure = new mongoose.Schema({
    image: {
        name: {
            type: String, 
            required: true, 
        },
        data: {
            type: Buffer, 
        },
        contentType: {
            type: String, 
            required: true
        },
    },
    name: {
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
    role: {
        type: String,
        enum: ["student", "admin"], 
        default: "admin",
    },

    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    studentID: {
        type: String,
    },
   
    phoneNumber: {
        type: String,
    },
    department: {
        type: String,
    },
    faculty: {
        type: String,
    },
    program: {
        type: String,
    },
    level: {
        type: String,
    },
    yearOfEnrollment: {
        type: Date,
    },
    yearOfCompletion: {
        type: Date,
    },

    fingerprintID: {
        type: String,
        unique: true
    },

    status: {
        type: String,
        enum: ["Present", "Absent"],
        default: 'Absent'
    },
    examStatus: {
        type: String,
        enum: ["Written", "Not written"],
        default: 'Not written'
    },
    examTime: {
        hour: {
            type: Number,
            required: true,
            default: 7
        },
        
        minute: {
            type: Number,
            required: true,
            default: 30
        },
        period: {
            type: String,
            enum: ['AM', 'PM'],
            required: true,
            default: 'AM'
        }
    },
    seatNumber: {
        type: String, 
    },
    refreshToken: {
        type: String,
    },
    lastLogin: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true 
})

const dbModel = mongoose.model('userData', dbStructure)
module.exports = dbModel