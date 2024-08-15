const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    
    image: {
        name: {
            type: String, 
            required: true, 
            unique: true
        },
        data: {
            type: Buffer, 
            required: true
        },
        contentType: {
            type: String, 
            required: true
        },
    },
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        requird: true
    },
    token: {
        type: String,
    },
    
    timeStamps,

})

const adminModel = mongoose.model('admin', adminSchema)
module.exports = adminModel;