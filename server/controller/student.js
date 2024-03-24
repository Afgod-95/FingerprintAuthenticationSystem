const mongoose = require('mongoose');
const studentData = require('../model/student.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const emailFormat = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const ghanaPhoneNumberRegex = /^0[23456789]([0-9]{8})$/;

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1h' }); // Set appropriate expiration
  return token;
};

// Create the destination folder if it doesn't exist
const destinationFolder = './image';
try {
  fs.mkdirSync(destinationFolder);
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error('Error creating destination folder:', err);
    // Handle the error, perhaps by sending a 500 response
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // file location
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    // Ensure file is available
    if (!file) {
      cb(new Error('No file received'), null);
    } else {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    }
  }
});

//image uploader
const upload = multer({ storage: storage });

const fingerprintController = {
  //registration start point 
  register: async (req, res) => {
    try {
      // Use the upload middleware to handle file uploads for a single file with the field name 'profilePic'
      upload.single('profilePic')(req, res, async (err) => {
        if (err) {
          console.error('Error uploading file:', err);
          return res.status(500).json({ error: 'Failed to upload file' });
        }

        // File uploaded successfully, continue with registration logic

        try {
          const {
            name,
            gender,
            dateOfBirth,
            studentID,
            email,
            phoneNumber,
            department,
            faculty,
            program,
            level,
            yearOfEnrollment,
            fingerPrint
          } = req.body;

          // Validate other fields
          if (!req.file) {
            return res.status(400).json({
              error: "Profile picture required"
            });
          }

          if (!name || !gender || !dateOfBirth || !studentID || !email || !phoneNumber || !department || !faculty || !program || !level || !yearOfEnrollment) {
            return res.status(400).json({
              error: 'All fields are required',
            });
          }

          if (!emailFormat.test(email)) {
            return res.status(400).json({
              error: 'Invalid email format',
            });
          }

          if (!ghanaPhoneNumberRegex.test(phoneNumber) || phoneNumber.length !== 10) {
            return res.status(400).json({
              error: 'Invalid mobile number',
            });
          }

          const exist = await studentData.findOne({ email });
          if (exist && exist.phoneNumber === phoneNumber) {
            return res.status(400).json({
              error: 'Email and phone number already exist',
            });
          }

          // Hash the fingerprint data before saving
          const hashedFingerprint = crypto.createHash('sha256').update(fingerPrint).digest('hex');

          // Check if the hashed fingerprint data already exists in the database
          const fingerPrintExist = await studentData.findOne({ fingerprint: hashedFingerprint });
          if (fingerPrintExist) {
            return res.status(400).json({
              error: 'Fingerprint already exists',
            });
          }

          // Save user registration details including the fingerprint data
          const profilePic = req.file.path;
          const newStudent = new studentData({
            profilePic: fs.readFileSync(profilePic),
            name,
            gender,
            dateOfBirth,
            studentID,
            email,
            phoneNumber,
            department,
            faculty,
            program,
            level,
            yearOfEnrollment,
            fingerPrintData: true,
            fingerprint: hashedFingerprint, // Store hashed fingerprint data
          });

          await newStudent.save();

          res.status(200).json({ success: true, message: 'Registration successful', newStudent });
          console.log('Registration successful', newStudent);
        }
        catch (error) {
          console.error(`Error: ${error.message}`);
          res.status(500).json({
            error: 'Internal Server Error',
          });
        }
      });
    }
    catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  // Other controller methods
  login: async (req, res) => {
    try {
      const { fingerprint } = req.body;
      if (!fingerprint) {
        return res.status(400).json({
          error: 'Fingerprint required',
        });
      }

      // Hash the provided fingerprint data
      const hashedFingerprint = crypto.createHash('sha256').update(fingerprint).digest('hex');

      const exist = await studentData.findOne({ fingerprint: hashedFingerprint });
      if (!exist || exist.fingerprint !== hashedFingerprint) {
        return res.status(400).json({
          error: "Fingerprint doesn't match",
        });
      }

      const token = generateToken(exist._id);
      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({
        error: error.message,
      });
    }
  },

};

module.exports = fingerprintController;
