
require('dotenv').config();
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router/adminRoutes')

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const studentRoute = require('./router/studentRoute');

const app = express();
const PORT = 5031;

console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);



// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  credentials: true
}));
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.json());


// Regular admin routes
app.use(router);

//student route
app.use(studentRoute)



// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err) {
    if (err.message && err.message.includes('Body Parser Error')) {
      console.error('Body Parser Error:', err.message);
      return res.status(400).json({ error: 'Invalid request body format' });
    } else {
      console.error('Error:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  next();
});




// Database connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  mongoose.set('debug', true);
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log(`Error: ${err}`);
});
