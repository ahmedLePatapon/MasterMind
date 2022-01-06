const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema({
    lastname: String,
    firstname: String,
    phone: String,
    email: String,
    password: String
});

module.exports = mongoose.model('Customer', customerSchema);