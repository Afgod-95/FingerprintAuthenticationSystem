



/*

const express = require('express')
const fingerprintController = require('../controller/student.js')
const adminController = require('../controller/admin.js')
const authenticate_middleware = require('../middleware/authMiddleware.js')
const adminModel = require('../model/admin.js')

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
router.post('/api/admin/forgot-password', adminController.AdminForgotPassword) //admin reset password request



router.patch('/api/admin/reset-password', adminController.adminUpdatePassword) //admin reset password 
router.patch('/api/admin/update-profile/:id', authenticate_middleware, adminController.updateAdminProfile) //update admin
router.patch('/api/admin/update-student/:id', adminController.updateStudentBy_ID) //update student by id

router.delete('/api/admin/delete-student/:id', adminController.deleteStudentBy_ID) //delete student by id
router.delete('/api/admin/delete-students', adminController.deleteManyStudent) //delete students
router.get('/api/admin/fetch-students', adminController.getAllStudents) //fetch students
router.get('/api/admin-profile/:id', authenticate_middleware, adminController.getAdminProfile)

//download and view students report
router.get('/api/admin/generate-report', adminController.generateStudentReport)

router.post('/api/student/verify-fingerprint', adminController.studentLogin)


//token 
router.get('/api/auth/verify-token', authenticate_middleware, (req, res) => {
    res.status(200).json({
        message: 'token is valid',
        token: req.user.role
    })
})

module.exports = router

*/