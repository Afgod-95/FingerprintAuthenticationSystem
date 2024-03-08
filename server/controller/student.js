const mongoose = require('mongoose');
const studentData = require('../model/student.js');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const emailFormat = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const ghanaPhoneNumberRegex = /^0[23456789]([0-9]{8})$/;

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1h' }); // Set appropriate expiration
  return token;
};

const fingerprintController = {
    //registration start point 
    register: async (req, res) => {
        try {
            const {
              profilePic,
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

            // Validation
            if (!profilePic || !name || !gender || !dateOfBirth || !studentID || !email || !phoneNumber || !department || !faculty || !program || !level || !yearOfEnrollment || !fingerprint) {
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

            // Hash the fingerprintData before saving
            const hashedFingerprint = crypto.createHash('sha256').update(fingerPrint).digest('hex');
            // Check if the hashed fingerprint data already exists in the database
            const fingerPrintExist = await studentData.findOne({ fingerprint: hashedFingerprint });
            if (fingerPrintExist) {
              return res.status(400).json({
                error: 'Fingerprint already exists',
              });
            }
            const newStudent = new studentData({
              profilePic,
              name,
              gender,
              dateOfBirth,
              studentID,
              email,
              phoneNumber,
              department,
              faculty,
              program,
              fingerPrintData: true,
              fingerprint: hashedFingerprint,
              level,
              yearOfEnrollment,
              token,
            });
      
            await newStudent.save();
      
            res.json({
              message: 'Registration successful',
              newStudent,
            });
            const token = generateToken(exist ? { userId: exist.user._id } : null)
        } 
        
        catch (error) {
          console.error(`Error: ${error.message}`);
          res.status(500).json({
            error: 'Internal Server Error',
          });
        }
        
    },
    //registration endPoint

    login: async (req, res) => {
        try {
          const { fingerPrintData } = req.body;
          if (!fingerPrintData) {
            return res.status(400).json({
              error: 'Fingerprint required',
            });
          }
    
          // Hash the provided fingerprint data
          const hashedFingerprint = crypto.createHash('sha256').update(fingerPrintData).digest('hex');
    
          const exist = studentData.findOne({ fingerprint: hashedFingerprint });
          if (!exist || exist.fingerPrintData === false) {
            return res.status(400).json({
              error: 'Fingerprint not recognized',
            });
          }
    
          const token = generateToken(exist._id);
          res.status(200).json({ token });
        } 
        catch (error) {
          console.error(`Error: ${error.message}`);
          res.status(500).json({
            error: 'Internal Server Error',
          });
        }
    },
};

module.exports = fingerprintController;
