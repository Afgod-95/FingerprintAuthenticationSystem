const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./router/router')
const dotenv = require('dotenv').config()

const app = express()
const PORT = 5031

// Middlewares with error handling
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(), (err, req, res, next) => { // Error handler for CORS
  if (err) {
    console.error('CORS Error:', err.message);
    res.status(500).json({ error: 'CORS configuration error' });
  } else {
    next();
  }
});
app.use((err, req, res, next) => { // Error handler for body parsing
  if (err) {
    console.error('Body Parser Error:', err.message);
    res.status(400).json({ error: 'Invalid request body format' });
  } else {
    next();
  }
});

// Routes
console.log('Router loaded:', router);
console.log('Routes added:', app.routes);
app.use(router);

//database connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
    console.log('Connected to MongoDB')
}).catch (err => {
    console.log(`Error: ${err}`)
}) 



