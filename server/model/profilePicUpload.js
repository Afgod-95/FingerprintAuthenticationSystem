
const mongoose = require('mongoose')

const profilePictureSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentData',
    required: true
  },
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
});

module.exports = mongoose.model('ProfilePicture', profilePictureSchema);