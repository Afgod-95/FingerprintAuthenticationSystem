const mongoose = require('mongoose');
const studentData = require('../model/student.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; 
const bcrypt = require('bcrypt')
const https = require('follow-redirects').https;


const emailFormat = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const ghanaPhoneNumberRegex = /^0[23456789]([0-9]{8})$/;

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1h' }); // Set appropriate expiration
  return token;
};




// Create the destination folder if it doesn't exist
const destinationFolder = 'E:/Native/FingerprintSystem/server/image'; // Use forward slashes or double backslashes
async function createDirectory() {
  try {
    await fs.mkdir(destinationFolder, { recursive: true }); // Use { recursive: true } to create nested directories if needed
    console.log(destinationFolder)
    console.log('Directory created successfully.');
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Error creating destination folder:', err);
    }
  }
}

// Call the async function to create the directory
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

            const profilePicPath = req.file ? req.file.path : null; // Check if file is uploaded

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

                // Validate other fields
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

                // Hash the fingerprint data before saving
                const hashedFingerprint = crypto.createHash('sha256').update(fingerprint).digest('hex');
                const hashedPassword = await bcrypt.hash(password, 12)
                // Check if the hashed fingerprint data already exists in the database
                if (!profilePicPath) {
                    return res.status(401).json({ error: 'Profile picture path is missing' });
                }
                const profilePicData = await fs.readFile(profilePicPath); // Read the profile picture data
                if (!profilePicData) {
                    return res.status(401).json({ error: 'Failed to read profile picture data' });
                }
                const base64Image = profilePicData.toString('base64'); // Convert profile picture data to base64
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

              const options = {
                'method': 'POST',
                'hostname': 'n8gnej.api.infobip.com',
                'path': '/sms/2/text/advanced',
                'headers': {
                    'Authorization': 'App d0c373d11d4fbe4c3926c6d291ac9d00-27eed1a1-6d0b-477b-8b32-a6042a264d46',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                'maxRedirects': 20
              };
              
              const req = https.request(options, function (res) {
                  const chunks = [];
              
                  res.on("data", function (chunk) {
                    chunks.push(chunk);
                  });
              
                  res.on("end", function (chunk) {
                      const body = Buffer.concat(chunks);
                      console.log(body.toString());
                  });
              
                  res.on("error", function (error) {
                    console.error(error);
                  });
              });
              
              const postData = JSON.stringify({
                  "messages": [
                    {
                      "destinations": [{"to":`${phoneNumber}`}],
                      "from": "ServiceSMS",
                      "text": "Hello,\n\nThis is a test message from Infobip. Have a nice day!"
                    }
                  ]
              });
              
              req.write(postData);
              
              req.end();
              

              res.status(200).json({ success: true, message: 'Registration successful', newStudent });
              console.log('Registration successful', newStudent);
              const token = generateToken(exist._id);
              res.status(200).json({ success: true, token });
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
      const { fingerprint, email, password } = req.body;
      if (!fingerprint) {
        return res.status(401).json({
          error: 'Fingerprint required',
        });
      }

      // Get user by email
      let existUser = await studentData.findOne({ email });
      if (existUser){
        return res.status(401).json({
          error: "Email already exist"
        })
      }
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({
            error: 'Invalid password',
          });
      }

      // Hash the provided fingerprint data
      const hashedFingerprint = crypto.createHash('sha256').update(fingerprint).digest('hex');
      const exist = await studentData.findOne({ fingerprint: hashedFingerprint });
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
