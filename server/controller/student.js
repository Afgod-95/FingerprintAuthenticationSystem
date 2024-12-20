const studentModel = require('../model/student.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');


//token generation
const generateToken = (user) => {
  const token = jwt.sign({ 
      id: user._id, 
      role: user.role 
  }, process.env.SECRET_KEY, { expiresIn: '1 hour' });
  return token;
};



const studentMapNumber = {};
let seatCounter = 1; 

const generate_Student_SeatNumber = async (studentID) => {
  if (studentMapNumber[studentID]) {
    return studentMapNumber[studentID];
  }
  const seatNo = seatCounter;
  studentMapNumber[studentID] = seatNo;
  seatCounter += 1;
  return seatNo;
};

    


const destinationFolder = 'E:/Native/FingerprintSystem/server/image';

async function createDirectory() {
  try {
    await fs.mkdir(destinationFolder, { recursive: true });
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
    fileSize: 1024 * 1024 * 50 
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
}).single('image');



const fingerprintController = {
  studentRegistration: async (req, res) => {
    try{
        upload(req, res, async (err) => {
            try {
                if (err) {
                    console.log('Error: Failed to upload profile image', err);
                    return res.status(400).json({
                    message: "Failed to upload profile image"
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
                    yearOfCompletion,
                    fingerprint,
                } = req.body;
        
                if (!req.file) {
                    console.log("No profile image received")
                    return res.status(400).json({
                        message: "No profile image received"
                    });
                }
        
                if (!password) {
                    return res.status(400).json({
                        message: 'Password is required'
                    });
                }
                
                //checking for existing students
                const existingStudent = await studentModel.findOne({ email });
                if (existingStudent && existingStudent.phoneNumber === phoneNumber) {
                    return res.status(401).json({
                    message: 'Email and phone number already exist',
                    });
                }
        
                const studentIdExist = await studentModel.findOne({ studentID });
                if (studentIdExist) {
                    return res.status(401).json({
                        message: 'Student ID already exists'
                    });
                }
        
                const hashedPassword = await bcrypt.hash(password, 12);
        
                const newStudent = new studentModel({
                    image: {
                        name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
                        data: fs.readFile(req.file.path),
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
                    yearOfCompletion,
                    seatNumber: await generate_Student_SeatNumber(studentID),
                    fingerPrintData: true,
                    fingerprint: crypto.createHash('sha256').update(fingerprint || '').digest('hex'),
                });
        
                await newStudent.save();
        
                if (newStudent) {
                    const token = generateToken(newStudent._id);
                    res.status(200).json({
                        success: true,
                        message: 'Registration successful',
                        newStudent,
                        token
                    });
                    console.log('Registration successful', newStudent);
                } 
                else {
                    res.status(500).json({
                    error: 'Failed to register user'
                    });
                }
            } 
            catch (error) {
                console.log(error.message);
                return res.status(400).json({
                    error: error.message
                });
            }
        });
    }
    catch(error){
        console.log(error.message);
        return res.status(400).json({
            error: error.message
        });
    }
    
},

//Fetch all students 
getAllStudents: async (req, res) => {
    try {
        await studentModel.find() 
        res.status(200).json({
            message: 'Students data retrieved successfully'
        })
    } 
    catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({
            message: 'Error! Failed to fetch students'
        })
    }
},

//delete student by id  from the database
deleteStudentBy_ID: async (req, res) => {
    try {
       const { id } = req.params  
        if ( !id ) {
            return res.status(400).json({
                message: 'Ooops! No student selected'
            })
        }

       const student =  await studentModel.findByIdAndDelete({ _id: id })
        res.status(200).json({
            message: `Student of ${student.studentID} deleted successfully`
        })
    } 
    catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({
            message: 'Error! Failed to delete student'
        })
    }
},


  // Login endpoint for student
  login: async (req, res) => {
    try {
      const { fingerprint, studentID, password } = req.body;
      if (!studentID || !password) {
        return res.status(400).json({
          error: "Please enter all fields"
        });
      }

      const student = await studentModel.findOne({ studentID });
      if (!student) {
        return res.status(401).json({
          error: "Student ID not found",
        });
      }

      const passwordMatch = await bcrypt.compare(password, student.password);
      if (!passwordMatch) {
        return res.status(401).json({
          error: 'Invalid password',
        });
      }

      const hashedFingerprint = crypto.createHash('sha256').update(fingerprint).digest('hex');
      const token = generateToken(student._id);
      await studentModel.findOneAndUpdate(
        { studentID: studentID }, 
        { $set: { status: "Present" } }, 
        { new: true } 
      );
      
      res.status(200).json({
        success: true,
        message: "Login Successful",
        token
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({
        error: error.message,
      });
    }
  },


  // send reset password
  ResetPassword: async (req, res) => {
    try{
      const { email } = req.body;
      if (!email){
        return res.status(400).json({
          error: "Please enter all fields"
        });
      }
      const student = await studentModel.findOne({ email: email })
      if (!student){
        return res.status(400).json({
          error: "Oops, email not found. Please check your email address."
        });
      }

      return res.status(200).json({
        message: 'Redirecting to reset password screen...'
      })

    }
    catch (error) {
      console.error(`Error: ${error.message}`)
    }
  },

  //password reset
  updatePassword: async (req, res) => {
    try {
      const { newPassword, confirmNewPassword, email } = req.body
      if (!newPassword || !confirmNewPassword){
        return res.status(400).json({
          error: "Please enter all fields"
        });
      }

      if (newPassword !== confirmNewPassword){
        return res.status(400).json({
          error: "Password does not match"
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      await studentModel.findOneAndUpdate(
        { email: email },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      res.status(200).json({
        message: 'Your password have been resetted successfully.'
      })
    } 
    catch (error) {
      console.log(`Error: ${error.message}`)
    }
  },

  //logout 
  logout: async (req, res) => {
    try {
      const { studentId } = req.body;
      const result = await studentModel.updateOne(
        { studentID: studentId },
        {
          $set: {
            status: 'Absent',
            token: null
          }
        }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({
          message: 'Student not found or no changes made.',
        });
      }
  
      res.status(200).json({
        message: 'You have been logged out successfully.',
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: 'Oops! An error occurred whilst logging out.',
      });
    }
  },
  
  
  // Fetching student data
  getStudentID: async (req, res) => {
    try {
      const { id } = req.params;
      const student = await studentModel.findOne({ studentID: id });
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
