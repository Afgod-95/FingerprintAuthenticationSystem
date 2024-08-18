const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
    studentID: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
});

const attendanceLogModel = mongoose.model('AttendanceLog', attendanceLogSchema);

module.exports = attendanceLogModel;
