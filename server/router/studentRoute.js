
const express = require('express')
const { studentLogin } = require('../controller/student/student')
const studentRoute = express.Router()

studentRoute.post('/api/student/login', studentLogin )

module.exports = studentRoute;