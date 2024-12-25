const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User name is required']
    },
    password: {
        type: String,
        required: [true, 'User password is required']
    }
})

module.exports = mongoose.model('User', userSchema); // 'User' is the name of the collection in the database