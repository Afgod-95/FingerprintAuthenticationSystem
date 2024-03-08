const express = require('express')
const fingerprintController = require('../controller/student')
const router = express.Router()

fingerprintController.someAsyncOperation().then(() => {
    router.post('/api/auth/login', fingerprintController.login);
    router.post('/api/auth/register', fingerprintController.register);
  });

module.exports = router