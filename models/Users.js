const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    pseudo: String,
    password: String
});

exports.User = mongoose.model('User', userSchema);