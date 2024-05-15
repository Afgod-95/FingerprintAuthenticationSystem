const studentData = require('../model/student.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; 
const bcrypt = require('bcrypt');
const profilePicUpload = require('../model/profilePicUpload.js');
const { v4: uuidv4 } = require('uuid');


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
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
}).single('image');

const fingerprintController = {
  //register
  register: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          console.log('Error: Failed to upload profile image', err);
          return res.status(400).json({
            error: "Failed to upload profile image"
          });
        }

        try {
          const profileImagePath = req.file ? req.file.path : null;
          if (!profileImagePath) {
            return res.status(400).json({
              error: "No profile image received"
            });
          }

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
            yearOfEnrollment,
          } = req.body;
      
          // Ensure that password is provided
          if (!password) {
            return res.status(400).json({
              error: 'Password is required'
            });
          }
      
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
      
          const hashedPassword = await bcrypt.hash(password, 12);
      
          const newStudent = new studentData({
            
            profilePic: {
              name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
              data: await fs.readFile(profileImagePath),
              contentType: req.file.mimetype
            },
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
          } 
          else {
            res.status(500).json({ error: 'Failed to register user' });
          }

        }
        catch (err) {
          console.log(err.message);
          return res.status(400).json({
            error: err.message
          });
        }
      });
    } 
    
    catch(err) {
      console.log("Error uploading profile image", err.message);
      return res.status(400).json({
        error: err.message
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
      res.status(200).json({
        message: `Student ID found successfully \n Student ID: ${id}`,
        student,
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



