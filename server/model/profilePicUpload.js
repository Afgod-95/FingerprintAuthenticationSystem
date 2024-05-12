
const mongoose = require('mongoose')

const profilePictureSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentData',
    required: true
  },
  profileImage: {
    type: Buffer,
    required: true
  }
});

module.exports = mongoose.model('ProfilePicture', profilePictureSchema);