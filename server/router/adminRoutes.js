const express = require('express')
const router = express.Router()


const { 
    adminRegistration, 
    adminLogin,
    adminUpdatePassword,
    getAdminProfile,
    updateAdminProfile,
    AdminForgotPassword,
    RefreshToken

 } = require('../controller/admin/adminController.js')

 //students
 const {
    studentRegistration,
    getAllStudents,
    deleteStudentBy_ID,
    deleteManyStudent,
    updateStudentBy_ID,
    generateReport

 } = require('../controller/admin/adminController.js')

 const userModel = require('../model/dbStructure.js')

 //tokenVerification
 const { isAdmin } = require('../middleware/verifyToken.js')

//admin regular routes
router.post('/api/admin/register', adminRegistration );
router.post('/api/admin/login', adminLogin);
router.post('/api/admin/forgot-password', AdminForgotPassword)
router.patch('/api/admin/reset-password', adminUpdatePassword);
router.get('/api/admin/profile/:id', isAdmin, getAdminProfile);
router.patch('/api/admin/update-profile/:id', updateAdminProfile);


//admin performing crud operation
router.post('/api/admin/student/register',  studentRegistration);
router.get('/api/admin/students', getAllStudents);
router.delete('/api/admin/student/:id', deleteStudentBy_ID);
router.delete('/api/admin/student/delete-all', deleteManyStudent);
router.patch('/api/admin/student/:id',  updateStudentBy_ID);
router.get('/api/admin/student/generate-report', generateReport);


//REFRESHTOKEN 
router.post('/api/refresh-token', RefreshToken);


//studentLogin

router.get('/api/all', async (req, res) => {
   try{
      const users = await userModel.find()
      res.json(users)
      console.log(users)
   }
   catch(error){
      console.log(error);
   }
})


module.exports = router;