const userModel = require('../../model/dbStructure')
const ExcelJS = require('exceljs')
const path = require('path');
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const fs = require('fs')



//password and email validators 
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


const phoneRegex = /^\d{10}$/;

const studentMapNumber = {}; 
let seatCounter = 1;

const generate_Student_SeatNumber = async (studentID) => {
  // Check if the student already has a seat number assigned
  if (studentMapNumber[studentID]) {
    return studentMapNumber[studentID];
  }

  // Assign the current seatCounter as the seat number for the student
  const seatNo = seatCounter;

  // Store the seat number for this student in the map
  studentMapNumber[studentID] = seatNo;

  // Increment the seatCounter for the next student
  seatCounter += 1;

  return seatNo;
};

//multer set up
const storage = multer.memoryStorage(); 
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
}).single('image');

//admin registration
module.exports.adminRegistration =  async (req, res) => {
    try {
        upload(req, res, async (err) => {
            try{

                if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).send('File too large. Maximum file size is 5MB.');
                }

                if (err) {
                    console.error(`Error during file upload: ${err.message}`);
                    return res.status(400).json({
                        error: 'Error uploading profile image: ' + err.message
                    });
                }
                console.log(`File received: ${req.file}`)
                if (!req.file) {
                    console.error('No profile image received');
                    return res.status(400).json({
                        error: 'No profile image received'
                    });
                }

                const { name, email, password } = req.body;
                if (!name || !email || !password ) {
                    return res.status(400).json({
                        error: 'All fields are required'
                    });
                }

                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        error: 'Ooops! Please enter a valid email'
                    });
                }

                if (!passwordRegex.test(password)) {
                    return res.status(400).json({
                        error: 'Password must be at least 8 characters long, include at least one letter, one number, and one special character.'
                    });
                }

                const user = await userModel.findOne({ email: email });
                if (user  ) {
                    if(user.role !== 'student'){
                        return res.status(400).json({
                            error: 'Admin already exists'
                        });
                    }
                    
                }

               
                const admin = new userModel({
                    image: {
                        name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
                        data: req.file.buffer,
                        contentType: req.file.mimetype
                    },
                    name: name,
                    email: email,
                    password: bcrypt.hashSync(password, 10),
                    role: "admin"
                });

                await admin.save(); 
                res.status(200).json({
                    message: 'Admin created successfully',
                    admin: admin,
                })
            }
            catch (error){
                console.error(`Failed to upload profile image: ${error.message}`);
                return res.status(500).json({
                    error: 'Internal server error'
                });
            }
        });
    } catch (error) {
        console.error(`Error in admin registration: ${error.message}`);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}


// Admin login
module.exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Oops! All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Oops! Please enter a valid email'
            });
        }

        // Find the user by email
        const user = await userModel.findOne({ email: email });
        if (!user || user.role !== "admin") {
            return res.status(400).json({
                error: 'Admin not found or user is not an admin'
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                error: 'Oops! Incorrect password'
            });
        }

        // Generate tokens
        const token = jwt.sign({ userID: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
        });

        const refreshToken = jwt.sign({ userID: user._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '1h'
        });

        // Save the refresh token in the user's record
        user.refreshToken = refreshToken;
        await user.save();

        // Respond with the tokens and admin info
        res.status(200).json({
            message: 'Admin logged in successfully',
            admin: user,
            token,
            refreshToken
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: 'An error occurred' });
    }
};


//update admin profile 
module.exports.updateAdminProfile = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            try {
                if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).send('File too large. Maximum file size is 5MB.');
                }

                if (err){
                    return res.status(400).json({
                        error: 'Ooops! No profile image received'
                    })
                }

                if (!req.file){
                    return res.status(400).json({
                       error: 'Ooops! Profile image is required'
                    })
                }


                const { name, email } = req.body
                const adminID = req.params.id
                
                if (!name || !email ) {
                    return res.status(400).json({
                       error: 'Please all fields are required'
                    })
                }

                
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        error: 'Ooops! Please enter a valid email'
                    });
                }

                await userModel.findByIdAndUpdate(
                    adminID,
                    {$set: 
                        {
                            image: {
                                name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
                                data: req.file.buffer,
                                contentType: req.file.mimetype
                            },
                            name: name,
                            email: email,
                        }
                    },
                    { new: true }
                )
                res.status(200).json({
                    message: 'Admin profile updated successfully'
                })
            } 
            catch (error) {
                console.log(`Error uploading profile image: ${error.message}`)
            }
        })
    } 
    catch (error) {
        console.log(`Error message: ${error.message}`)
    }
},

// admin reset password request
module.exports.AdminForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email address'
            });
        }

        const normalizedEmail = email.toLowerCase();

        const adminUser = await userModel.findOne({ email: normalizedEmail, role: 'admin' });

        if (!adminUser) {
            return res.status(400).json({
                error: "Oops, email not found. Please check your email address."
            });
        }

        return res.status(200).json({
            message: 'Redirecting to reset password screen...'
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};


//password reset
module.exports.adminUpdatePassword = async (req, res) => {
    try {
        const { email, newPassword, } = req.body
        
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Ooops! Please enter a valid email'
            });
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long, include at least one letter, one number, and one special character.'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)
        await userModel.findOneAndUpdate(
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

module.exports.getAdminProfile = async (req, res) => {
    try {
       

        const id = req.params.id;
        console.log('Request Params:', req.params);
       
        if (!id) {
            return res.status(400).json({ error: 'ID parameter is missing' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const admin = await userModel.findById(id);

        if (!admin) {
            if( admin.role === 'student'){
                console.log(`Get Admin: admin id ${id} not found`);
                return res.status(404).json({ error: 'Admin not found' });
            }
           
        }

        res.status(200).json({
            message: 'Admin data retrieved successfully',
            admin
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}








module.exports.studentRegistration = async (req, res) => {
    try {
      upload(req, res, async (err) => {
        console.log('Multer upload function called');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
  
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send('File too large. Maximum file size is 50MB.');
        }
  
        if (err) {
          console.error('Error during file upload:', err.message);
          return res.status(400).json({ error: 'Error uploading profile image' });
        }
  
        if (!req.file) {
          console.log('No file received in the request');
          return res.status(400).json({ error: 'No file received' });
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
          fingerprintID
        } = req.body;
  
        if (!name || !gender || !dateOfBirth || !studentID || !email || !password || !phoneNumber || !department || !faculty || !program || !level || !yearOfEnrollment || !yearOfCompletion || !fingerprintID) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
  
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Please enter a valid email.' });
        }
  
        if (!passwordRegex.test(password)) {
          return res.status(400).json({ error: 'Password must be at least 6 characters long, include at least one letter, one number, and one special character.' });
        }
  
        if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({ error: 'Please enter a valid phone number.' });
        }
  
        const existingStudent = await userModel.findOne({ email });
        if (existingStudent && existingStudent.phoneNumber === phoneNumber) {
          return res.status(401).json({ error: 'Email and phone number already exist' });
        }
  
        const studentIdExist = await userModel.findOne({ studentID });
        if (studentIdExist && studentIdExist.role !== 'admin') {
          return res.status(401).json({ error: 'Student ID already exists' });
        }
  
        const newStudent = new userModel({
          image: {
            name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
            data: req.file.buffer,
            contentType: req.file.mimetype
          },
          name,
          gender,
          dateOfBirth,
          studentID,
          email,
          password: await bcrypt.hash(password, 12),
          phoneNumber,
          department,
          faculty,
          program,
          level,
          yearOfEnrollment,
          yearOfCompletion,
          seatNumber: await generate_Student_SeatNumber(studentID),
          role: 'student',
          fingerprintID
        });
  
        await newStudent.save();
  
        res.status(200).json({
          success: true,
          message: 'Registration successful',
          newStudent
        });
      });
    } catch (error) {
      console.error('Error during student registration:', error.message);
      res.status(400).json({ error: 'An error occurred during registration' });
    }
  };
  
  

//delete student by id  from the database
module.exports.deleteStudentBy_ID = async (req, res) => {
    try {
       const { id } = req.params  
        if ( !id ) {
            return res.status(400).json({
                error: 'Ooops! Only one student should be selected'
            })
        }

       const student =  await userModel.findByIdAndDelete(id)
       if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            })
        }
        res.status(200).json({
            message: `Student of ${student.studentID} deleted successfully`
        })
    } 
    catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({
            error: 'Error! Failed to delete student'
        })
    }
},

module.exports.deleteManyStudent = async (req, res) => {
    try {
        const { ids } = req.body;
        console.log('Received IDs:', ids);  // Log received IDs

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                error: 'No student IDs provided for deletion'
            });
        }

        const specialValues = ['delete-all']; // Add more special cases if needed
        const hasSpecialValues = ids.some(id => specialValues.includes(id));
        if (hasSpecialValues) {
            return res.status(400).json({
                error: 'Special value(s) like "deleteAll" are not allowed'
            });
        }

        const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                error: `Invalid ID(s): ${invalidIds.join(', ')}`
            });
        }

        const result = await userModel.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: 'No students found with the provided IDs'
            });
        }

        res.status(200).json({
            message: `${result.deletedCount} student(s) deleted successfully`
        });
    } catch (error) {
        console.error(`Error deleting students: ${error.message}`, { error, ids });
        res.status(500).json({
            error: 'Error! Failed to delete students'
        });
    }
}






module.exports.updateStudentBy_ID = async (req, res) => {
    try {
        const { id } = req.params 
        if ( !id ) {
            return res.status(400).json({
                error: 'Ooops! No student selected'
            })
        }

        console.log("Student ID:", id);
        console.log("Request body:", req.body);
       


        const updatedData = req.body
        const student = await userModel.findOneAndUpdate({ _id: id}, {
            $set: updatedData,
        }, { new: true, runValidators: true})
       
        res.status(200).json({
            message: `Student updated successfully`,
            student: student
        })
        console.log("Updated student:", student);
    } 
    catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({
            error: 'Error, Failed to update student'
        })
    }
},

module.exports.generateReport = async (req, res) => {
    try {
      const students = await userModel.find().lean(); 
  
      const fileName = 'student_report.xlsx';
      const filePath = path.join(__dirname, fileName);
  
      // Generate Excel report
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Student Report');
      worksheet.columns = [
          { header: 'Profile Image', key: 'image', width: 15 },
          { header: 'Name', key: 'name', width: 30 },
          { header: 'Gender', key: 'gender', width: 15 },
          { header: 'Date of Birth', key: 'dateOfBirth', width: 20 },
          { header: 'Student ID', key: 'studentID', width: 20 },
          { header: 'Seat Number', key: 'seatNumber', width: 15 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Phone Number', key: 'phoneNumber', width: 20 },
          { header: 'Department', key: 'department', width: 30 },
          { header: 'Faculty', key: 'faculty', width: 30 },
          { header: 'Program', key: 'program', width: 30 },
          { header: 'Level', key: 'level', width: 10 },
          { header: 'Year of Enrollment', key: 'yearOfEnrollment', width: 20 },
          { header: 'Year of Completion', key: 'yearOfCompletion', width: 20 },
          { header: 'Created At', key: 'createdAt', width: 25 },
      ];
  
      // Header styles
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D3D3D3' },
      };
  
      // Populate rows
      for (const student of students) {
        const row = worksheet.addRow({
          name: student.name,
          gender: student.gender,
          dateOfBirth: student.dateOfBirth ? student.dateOfBirth.toISOString().split('T')[0] : '',
          studentID: student.studentID,
          seatNumber: student.seatNumber,
          status: student.status,
          email: student.email,
          phoneNumber: student.phoneNumber,
          department: student.department,
          faculty: student.faculty,
          program: student.program,
          level: student.level,
          yearOfEnrollment: student.yearOfEnrollment ? student.yearOfEnrollment.toISOString().split('T')[0] : '',
          yearOfCompletion: student.yearOfCompletion ? student.yearOfCompletion.toISOString().split('T')[0] : '',
          createdAt: student.createdAt ? student.createdAt.toISOString() : '',
        });
  
        if (student.image && student.image.data) {
          let imageBuffer;
  
          if (typeof student.image.data === 'string') {
            // Assuming the image is stored as a Base64 string
            try {
              imageBuffer = Buffer.from(student.image.data, 'base64');
            } catch (error) {
              console.error('Error decoding Base64 image data for student:', student.name, error);
              continue; // Skip this student if there's an error
            }
          } else if (Buffer.isBuffer(student.image.data)) {
            imageBuffer = student.image.data;
          } else {
            console.error('Unsupported image data format for student:', student.name);
            continue; // Skip the image if it's not in a supported format
          }
  
          try {
            const imageId = workbook.addImage({
              buffer: imageBuffer,
              extension: student.image.contentType.split('/')[1], // Extract file extension from contentType
            });
  
            worksheet.addImage(imageId, {
              tl: { col: 0, row: row.number - 1 }, // Top-left corner (cell A)
              ext: { width: 60, height: 60 }, // Specify the size of the image
            });
  
            worksheet.getRow(row.number).height = 45; // Adjust the row height to fit the image
          } catch (error) {
            console.error('Error adding image to Excel for student:', student.name, error);
          }
        }
      }
  
      await workbook.xlsx.writeFile(filePath);
  
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(400).json({ error: 'Error generating Excel report' });
        }
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        }); 
      });
  
    } catch (error) {
      console.error('Error generating report:', error.message);
      res.status(500).json({ error: 'Failed to download report' });
    }
  };



// Endpoint to refresh the access token
module.exports.RefreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }

    console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET); // Add this line

    if (!process.env.REFRESH_TOKEN_SECRET) {
        console.error('REFRESH_TOKEN_SECRET is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const newAccessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        });

        const newRefreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d' 
        });

        console.log(`New access token: ${newAccessToken}`);
        console.log(`New refresh token: ${newRefreshToken}`);
        console.log('Received refresh token:', refreshToken);
        res.json({
            newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error('JWT Error:', error.message);
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            console.error('Token Expired:', error.message);
            return res.status(401).json({ error: 'Token expired' });
        }
          console.error('Unexpected error:', error);
          res.status(500).json({ error: 'Internal server error' });
    }
    
};



//fetch students 
module.exports.getAllStudents = async (req, res) => {
    try {
        const students = await userModel.find({ role: 'student'}).populate('studentID');
        if (!students){
            res.status(400).json({
                message: 'No students found',
            });
        }

        else{
            res.status(200).json({
                students: students,
                message: 'Students retrieved successfully'
            });
        }
    }
    catch(error){
        console.error('Error fetching students:', error.message);
    }
}