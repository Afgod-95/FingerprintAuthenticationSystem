const express = require('express')
const fingerprintController = require('../controller/student.js')
const adminController = require('../controller/admin.js')

const router = express.Router()

router.post('/api/auth/login', fingerprintController.login)

router.get('/api/student/:id', fingerprintController.getStudentID)
router.post('/api/auth/forgot-password', fingerprintController.ResetPassword)
router.post('/api/auth/reset-password', fingerprintController.updatePassword)
router.post('/api/auth/logout', fingerprintController.logout)

router.post('/api/student/login', adminController.studentLogin) 


//admin routes
router.post('/api/admin/student-registration', adminController.studentRegistration) //student registration
router.post('/api/admin/login', adminController.adminLogin) // admin login
router.post('/api/admin/register', adminController.adminRegistration) //admin register
router.post('/api/admin/logout', adminController.adminLogout) //admin logout
router.post('/api/admin/forgot-password', adminController.AdminResetPassword) //admin reset password request



router.patch('/api/admin/reset-password', adminController.AdminResetPassword) //admin reset password 
router.patch('/api/admin/update-profile', adminController.updateAdminProfile) //update admin
router.patch('/api/admin/update-student/:id', adminController.updateStudentBy_ID) //update student by id

router.delete('/api/admin/delete-student/:id', adminController.deleteStudentBy_ID) //delete student by id
router.delete('/api/admin/delete-students', adminController.deleteManyStudent) //delete students
router.get('/api/admin/fetch-students', adminController.getAllStudents) //fetch students

//download and view students report
router.get('/api/admin/generate-report', adminController.generateStudentReport)


//student log with fingerprint
router.post('/api/student/verify-fingerprint', adminController.studentLogin)

module.exports = router