const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./router/router')
const dotenv = require('dotenv').config()

const app = express()
const PORT = 5031

//middlewares 
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

//routes or path
console.log('Router loaded:', router); // Add this line
console.log('Routes added:', app.routes); // Add this line

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



