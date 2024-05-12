const studentData = require('../model/student.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; 
const bcrypt = require('bcrypt');
const profilePicUpload = require('../model/profilePicUpload.js');

const emailFormat = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const ghanaPhoneNumberRegex = /^0[23456789]([0-9]{8})$/;

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1h' }); 
  return token;
};

const destinationFolder = 'E:/Native/FingerprintSystem/server/image'; 
async function createDirectory() {
  try {
    await fs.mkdir(destinationFolder, { recursive: true }); 
    console.log(destinationFolder);
    console.log('Directory created successfully.');
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Error creating destination folder:', err);
    }
  }
}

createDirectory();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    if (!file) {
      cb(new Error('No file received'), null);
    } else {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    }
  }
});

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
}).single('profile');

const fingerprintController = {
  //profile picture
  profileImageUpload: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          console.log('Error: Failed to upload profile image', err);
          return res.status(400).json({
            error: "Failed to upload profile image"
          });
        }

        try{
          const studentId = req.body.studentID;
          const profileImage = req.file && req.file.buffer;
          if (!profileImage) {
            return res.status(400).json({
              error: "No profile image received"
            });
          }
          console.log('Profile', profileImage)

          const student = await studentData.findOne({ studentID: studentId });
          if (!student) {
            return res.status(404).json({
              error: "Student not found"
            });
          }
          
          const profilePicture = new profilePicUpload({
            studentId: student._id,
            profileImage: profileImage
          });
      
          await profilePicture.save();
          res.status(200).json({ 
            message: 'Profile picture uploaded successfully' 
          });
          console.log(profilePicture);

        }
        catch(err) {
          console.log("Error uploading profile image", err.message);
          return res.status(400).json({
            error: err.message
          });
        }
      });

    } catch (err) {
      console.log(err.message);
      return res.status(400).json({
        error: err.message
      });
    }
  },
  
  //register start point
  register: async (req, res) => {
    try {
      const {
        name,
        gender,
        dateOfBirth,
        studentID,
        email,
        password,
        phoneNumber,
        department,
        faculty,
        program,
        level,
        yearOfEnrollment
      } = req.body;
      
      // Checking for other required fields...
      const exist = await studentData.findOne({ email });
      if (exist && exist.phoneNumber === phoneNumber) {
        return res.status(401).json({
          error: 'Email and phone number already exist',
        });
      }

      const studentIdExist = await studentData.findOne({ studentID: studentID });
      if (studentIdExist) {
        return res.status(401).json({
          error: 'Student Index already exist'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      
      const newStudent = new studentData({
        name,
        gender,
        dateOfBirth,
        studentID,
        email,
        password: hashedPassword,
        phoneNumber,
        department,
        faculty,
        program,
        level,
        yearOfEnrollment,
        fingerPrintData: true,
        fingerprint: crypto.createHash('sha256').update(req.body.fingerprint || '').digest('hex'),
      });

      await newStudent.save();

      if (newStudent) {
        const token = generateToken(newStudent._id);
        res.status(200).json({ success: true, message: 'Registration successful', newStudent, token });
        console.log('Registration successful', newStudent);
      } else {
        res.status(500).json({ error: 'Failed to register user' });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },

  //login endpoint for student
  login: async (req, res) => {
    try {
      const { fingerprint, studentID, password } = req.body;
      if (!studentID || !password){
        return res.status(400).json({ 
          error: "Please enter all fields"
        });
      }
      // Get user by email
      const studentIDNo = await studentData.findOne({ studentID });
      if (!studentIDNo) {
        return res.status(401).json({
          error: "Student ID not found",
        });
      }

      const passwordMatch = await bcrypt.compare(password, studentIDNo.password);

      if (!passwordMatch) {
        return res.status(401).json({
          error: 'Invalid password',
        });
      }

      // Hash the provided fingerprint data
      const hashedFingerprint = crypto.createHash('sha256').update(fingerprint).digest('hex');
      const exist = await studentData.findOne({ studentID: studentID });
      const token = generateToken(exist._id);
      console.log(token);
      res.status(200).json({ success: true,
        message: "Login successful", token
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({
        error: error.message,
      });
    }
  },
  //fetching student data
  getStudentID: async (req, res) => {
    try {
      const { id } = req.params;
      const student = await studentData.findOne({ studentID: id });
      if (!student) {
        return res.status(404).json({
          error: "Student not found"
        });
      }

      const profilePicture = await profilePicUpload.findOne({ studentId: student._id });
      if (!profilePicture) {
        console.log('Profile picture not found');
        return res.status(404).json({
          error: "Profile picture not found"
        });
      }

      res.status(200).json({
        message: `Student ID found successfully \n Student ID: ${id}`,
        student,
        profilePicture
      });
      console.log(student);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({
        error: error.message
      });
    }
  }

};

module.exports = fingerprintController;



