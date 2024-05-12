const express = require('express')
const fingerprintController = require('../controller/student')
const router = express.Router()

router.post('/api/auth/login', fingerprintController.login)
router.post('/uploadImage', fingerprintController.profileImageUpload)
router.post('/api/auth/register', fingerprintController.register)
router.get('/api/student/:id', fingerprintController.getStudentID)

module.exports = router