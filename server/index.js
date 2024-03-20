const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./router/router')
const dotenv = require('dotenv').config()

const app = express()
const PORT = 5031

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // CORS middleware
// Regular routes
app.use(router);
console.log('Routes added:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  }
});

// Error handling middleware for CORS
app.use((err, req, res, next) => {
  if (err) {
    console.error('CORS Error:', err.message);
    res.status(500).json({ error: 'CORS configuration error' });
  } else {
    next();
  }
});

// Error handling middleware for body parsing
app.use((err, req, res, next) => {
  if (err) {
    console.error('Body Parser Error:', err.message);
    res.status(400).json({ error: 'Invalid request body format' });
  } else {
    next();
  }
});

//database connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
    console.log('Connected to MongoDB')
}).catch (err => {
    console.log(`Error: ${err}`)
}) 



