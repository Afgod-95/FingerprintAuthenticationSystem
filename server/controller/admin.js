const studentModel = require('../model/student');
const adminModel = require('../model/admin')
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');

const zkteco = require('zkteco-js');

const device = new zkteco();

const captureFingerprint = async () => {
    let fingerprint;
    try {
        // Open the socket connection
        await device.createSocket();
        
        // Ensure the socket is open
        if (!device.socket || !device.socket.writable) {
            throw new Error('Socket is not open');
        }

        // Capture the fingerprint
        fingerprint = await device.getFingerprint();

        // Ensure disconnection happens after successful operation
        if (device.socket && device.socket.writable) {
            await device.disconnect();
        }

        return fingerprint;
    } catch (error) {
        // Attempt to disconnect in case of errors
        try {
            if (device.socket && device.socket.writable) {
                await device.disconnect();
            }
        } catch (disconnectError) {
            console.error(`Disconnect Error: ${disconnectError.message}`);
        }
        console.error(`Fingerprint Error: ${error.message}`);
        throw error; // Propagate the error
    }
};

// Example usage
captureFingerprint()
    .then(fingerprint => console.log('Fingerprint captured:', fingerprint))
    .catch(error => console.error('Error capturing fingerprint:', error));








//generate tokens 
const generateToken = (user) => {
    const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '1 hour'})
    return token
}


const studentMapNumber = {}; // Map to store seat numbers by studentID
let seatCounter = 1; // Counter to generate unique seat numbers

const generate_Student_SeatNumber = async (studentID) => {
  // If a seat number is already assigned to this studentID, return it
  if (studentMapNumber[studentID]) {
    return studentMapNumber[studentID];
  }
  
  // Assign the next seat number to this studentID
  const seatNo = seatCounter;
  studentMapNumber[studentID] = seatNo;

  // Increment the seat counter for the next student
  seatCounter += 1;

  return seatNo;
};
    
//multer setup
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
}).single('image')

const adminController = {
    //admin registration 
    adminRegistration: async(req, res) => {
        try {
            upload(req, res, async (err) => {
                try {
                    if (err){
                        return res.status(400).json({
                            message: 'Ooops! No profile image received'
                        });
                    }
    
                    const { name, email, password } = req.body;
                    if (!name || !email || !password) {
                        return res.status(400).json({
                            message: 'Please all fields are required'
                        });
                    }
    
                    const adminExist = await adminModel.findOne({ email: email });
                    if (adminExist){
                        return res.status(400).json({
                            message: 'Ooops! Admin already exists'
                        });
                    }
    
                    const newAdmin = new adminModel({
                        image: {
                            name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
                            data: req.file.buffer, // Use buffer since memory storage is used
                            contentType: req.file.mimetype
                        },
                        name: name,
                        email: email,
                        password: bcrypt.hashSync(password, 10)
                    });
    
                    await newAdmin.save(); // Save the new admin first
                    const token = generateToken(newAdmin._id); // Generate token after saving
                    newAdmin.token = token;
    
                    await newAdmin.save(); // Save the admin with the token
    
                    res.status(200).json({
                        message: 'You have registered as admin'
                    });
                } 
                catch (error) {
                    console.log(`Error uploading profile image: ${error.message}`);
                    return res.status(400).json({ message: error.message });
                }
            });
        } 
        catch (error) {
            console.log(`Error message: ${error.message}`);
            return res.status(400).json({ message: error.message });
        }
    },

    //admin login 
    adminLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password){
                return res.status(400).json({
                    message: 'Oops! All fields are required'
                });
            }
    
            const adminExist = await adminModel.findOne({ email: email });
            if (!adminExist){
                return res.status(400).json({
                    message: 'Oops! Name not found'
                });
            }
    
            const hashedPassword = await bcrypt.compare(password, adminExist.password);
            if (!hashedPassword){
                return res.status(400).json({
                    message: 'Oops! Incorrect password'
                });
            }
    
            res.status(200).json({
                message: 'Admin logged in successfully',
            });
    
        } catch (error) {
            console.log(`Error message: ${error.message}`);
            return res.status(500).json({ message: 'An error occurred' });
        }
    },

    //logout 
    adminLogout: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await adminModel.findByIdAndUpdate(
                id, // Pass ID directly
                { $set: { token: null } }
            );
        
            if (!result) {
                return res.status(404).json({
                    message: 'Admin not found or no changes made.',
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

    //update admin profile
    updateAdminProfile: async (req, res) => {
        try {
            upload(req, res, async (err) => {
                try {
                    if (err){
                        return res.status(400).json({
                            message: 'Ooops! No profile image received'
                        })
                    }

                    if (!req.file){
                        return res.status(400).json({
                            message: 'Ooops! Profile image is required'
                        })
                    }

                    const { name, email, password } = req.body
                    if (!name || !email || !password) {
                        return res.status(400).json({
                            message: 'Please all fields are required'
                        })
                    }
                    
                    await adminModel.findOne(
                        { email: email},
                        {$set: 
                            {
                                image: {
                                    name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
                                    data: fs.readFile(req.file.path),
                                    contentType: req.file.mimetype
                                },
                                name: name,
                                email: email,
                                password: bcrypt.hashSync(password, 10),
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
    AdminResetPassword: async (req, res) => {
        try{
        const { email } = req.body;
        if (!email){
            return res.status(400).json({
            error: "Please enter all fields"
            });
        }
        const adminEmail = await adminModel.findOne({ email: email })
        if (!adminEmail){
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
    adminUpdatePassword: async (req, res) => {
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
            await adminModel.findOneAndUpdate(
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

    






    
    //student registration by admin
    studentRegistration: async (req, res) => {
        try {
            upload(req, res, async (err) => {
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
                } = req.body;
    
                if (!req.file) {
                    console.log("No profile image received");
                    return res.status(400).json({
                        message: "No profile image received"
                    });
                }
    
                if (!password) {
                    return res.status(400).json({
                        message: 'Password is required'
                    });
                }
    
                // Checking for existing students
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
    
                // Capture the fingerprint
                const fingerprint = await captureFingerprint();
    
                if (!fingerprint) {
                    return res.status(400).json({
                        message: 'Failed to capture fingerprint'
                    });
                }
    
                const hashedPassword = await bcrypt.hash(password, 12);
    
                const newStudent = new studentModel({
                    image: {
                        name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
                        data: req.file.buffer, // Use buffer since memory storage is used
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
                    fingerprintData: fingerprint.buffer // Save the fingerprint data
                });
    
                await newStudent.save();
    
                const token = generateToken(newStudent._id);
                res.status(200).json({
                    success: true,
                    message: 'Registration successful',
                    newStudent,
                    token
                });
            });
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error: error.message
            });
        }
    },
    

    //student login
    studentLogin: async (req, res) => {
        try {
            // Capture the fingerprint of the student
            const capturedFingerprint = await captureFingerprint();
            
            if (!capturedFingerprint) {
                return res.status(400).json({ message: 'Failed to capture fingerprint' });
            }
            
            // Find the student with the matching fingerprint
            const student = await studentModel.findOne({ fingerprintData: capturedFingerprint.buffer });
            
            if (!student) {
                return res.status(401).json({ message: 'Authentication failed: fingerprint not recognized' });
            }
            
            // Generate a token for the student
            const token = generateToken(student._id);
            
            // Return student data along with the token
            res.status(200).json({
                message: 'Login successful',
                student: {
                    name: student.name,
                    studentID: student.studentID,
                    email: student.email,
                    phoneNumber: student.phoneNumber,
                    department: student.department,
                    faculty: student.faculty,
                    program: student.program,
                    level: student.level,
                    yearOfEnrollment: student.yearOfEnrollment,
                    yearOfCompletion: student.yearOfCompletion,
                    seatNumber: student.seatNumber,
                    dateOfBirth: student.dateOfBirth,
                },
                token
            });
        } catch (error) {
            console.error(`Error during student login: ${error.message}`);
            res.status(500).json({ message: 'An error occurred during login' });
        }
    },

    
    //Fetch all students 
    getAllStudents: async (req, res) => {
        try {
            const students = await studentModel.find(); 
            res.status(200).json({
                message: 'Students data retrieved successfully',
                students 
            });
        } 
        catch (error) {
            console.log(`Error: ${error.message}`);
            res.status(500).json({
                message: 'Error! Failed to fetch students'
            });
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

    //delete many student from the database
    deleteManyStudent: async (req, res) => {
        try {
            await studentModel.deleteMany()
            res.status(200).json({
                message: 'Students deleted successfully'
            })
        } 
        catch (error) {
            console.log(`Error: ${error.message}`)
            res.status(500).json({
                message: 'Error! Failed to delete students'
            })
        }
    }, 
    
    
    updateStudentBy_ID: async (req, res) => {
        try {
            const { id } = req.params  
            if ( !id ) {
                return res.status(400).json({
                    message: 'Ooops! No student selected'
                })
            }
           const student =  await studentModel.findByIdAndUpdate({ _id: id }, { new: true })
            res.status(200).json({
                message: `Student updated successfully`
            })
        } 
        catch (error) {
            console.log(`Error: ${error.message}`)
            res.status(500).json({
                message: 'Error, Failed to update student'
            })
        }
    },

    // Generating student report from JSON to Excel or CSV file
    generateStudentReport: async (req, res) => {
        try {
            const fileType = req.query.fileType || 'csv'; // Get file type from query parameter, default to 'csv'
            const students = await studentModel.find().lean(); // Get all student data

            const fileName = `student_report.${fileType}`;
            const filePath = path.join(__dirname, fileName);

            if (fileType === 'csv') {
                // Generate CSV report
                const fields = [
                    'name',
                    'gender',
                    'dateOfBirth',
                    'studentID',
                    'email',
                    'phoneNumber',
                    'department',
                    'faculty',
                    'program',
                    'level',
                    'yearOfEnrollment',
                    'yearOfCompletion',
                    'fingerPrintData',
                    'status',
                    'seatNumber',
                    'createdAt'
                ];

                const json2csvParser = new Parser({ fields });
                const csv = json2csvParser.parse(students);

                fs.writeFileSync(filePath, csv);

                res.download(filePath, fileName, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).json({ message: 'Error generating CSV report' });
                    }
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error deleting file:', err);
                    }); // Clean up the file after sending
                });
            } else if (fileType === 'excel') {
                // Generate Excel report
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Student Report');

                // Define columns with headers and widths
                worksheet.columns = [
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
                    { header: 'Fingerprint Data', key: 'fingerPrintData', width: 30 },
                    { header: 'Created At', key: 'createdAt', width: 25 },
                ];

                // Apply header styles
                worksheet.getRow(1).font = { bold: true };
                worksheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D3D3D3' } // Light grey background color
                };

                // Add rows
                students.forEach(student => {
                    worksheet.addRow({
                        ...student,
                        dateOfBirth: student.dateOfBirth.toISOString().split('T')[0],
                        yearOfEnrollment: student.yearOfEnrollment.toISOString().split('T')[0],
                        yearOfCompletion: student.yearOfCompletion.toISOString().split('T')[0],
                        createdAt: student.createdAt.toISOString()
                    });
                });

                // Ensure the file is properly saved
                await workbook.xlsx.writeFile(filePath);

                res.download(filePath, fileName, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).json({ message: 'Error generating Excel report' });
                    }
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error deleting file:', err);
                    }); // Clean up the file after sending
                });
            } else {
                res.status(400).json({ message: 'Invalid file type specified. Please choose either "csv" or "excel".' });
            }
        } catch (error) {
            console.error('Error generating report:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};







module.exports = adminController;
