const mongoose = require('mongoose');
const studentData = require('../model/student.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; 
const bcrypt = require('bcrypt')


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
    console.log(destinationFolder)
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

const upload = multer({ storage: storage });

const fingerprintController = {
  register: async (req, res) => {
    try {
        upload.single('profilePic')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ error: 'Failed to upload file' });
            }

            const profilePicPath = req.file ? req.file.path : null; 

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

                const fingerprint = req.body.fingerprint || '';

                console.log(typeof fingerprint)

                if (!req.file) {
                    return res.status(401).json({
                        error: "Profile picture required"
                    });
                }

                if (!name || !gender || !dateOfBirth || !studentID || !email || !password || !phoneNumber || !department || !faculty || !program || !level || !yearOfEnrollment) {
                    return res.status(401).json({
                        error: 'All fields are required',
                    });
                }

                if (!emailFormat.test(email)) {
                  return res.status(401).json({
                    error: 'Invalid email format',
                  });
                }

                if (!ghanaPhoneNumberRegex.test(phoneNumber) || phoneNumber.length !== 10) {
                  return res.status(401).json({
                      error: 'Invalid mobile number',
                  });
                }

                const exist = await studentData.findOne({ email });
                if (exist && exist.phoneNumber === phoneNumber) {
                  return res.status(401).json({
                      error: 'Email and phone number already exist',
                  });
                }
                
                const studentIdExist = await studentData.findOne({ studentID: studentID })
                if (studentIdExist){
                  return res.status(401).json({
                    error: 'Student Index already exist'
                  })
                }

                const hashedFingerprint = crypto.createHash('sha256').update(fingerprint).digest('hex');
                const hashedPassword = await bcrypt.hash(password, 12)
                if (!profilePicPath) {
                    return res.status(401).json({ error: 'Profile picture path is missing' });
                }
                const profilePicData = await fs.readFile(profilePicPath); 
                if (!profilePicData) {
                    return res.status(401).json({ error: 'Failed to read profile picture data' });
                }
                const base64Image = profilePicData.toString('base64'); 
                console.log(`ProfileImage: ${base64Image}`)
                const newStudent = new studentData({
                  profilePic: base64Image,
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
                  fingerprint: hashedFingerprint,
              });

              await newStudent.save();

              if (newStudent) {
                const token = generateToken(newStudent._id);
                res.status(200).json({ success: true, message: 'Registration successful', newStudent, token });
                console.log('Registration successful', newStudent);
              } else {
                res.status(500).json({ error: 'Failed to register user' });
              }
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
    console.log(token)
    res.status(200).json({ success: true,
      message: "Login successfull", token
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      error: error.message,
    });
  }
},

getStudentID: async (req, res) => {
  try{
    const { studentId } = req.params

    const student = await studentData.find({ studentID: studentId })
    if (student){
      res.status(200).json({
        message: `Student ID found successfully \n Student ID: ${studentId}`,
        student
      })
    }

    else{
      res.status(200).json({
        message: `Student ID not found\n Student ID: ${studentId}`,
        student
      })
    }
  }
  catch (error){
    res.status(500).json({
      error: error.message
    })
  }
}
};

module.exports = fingerprintController;
