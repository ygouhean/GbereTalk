const mongoose = require('mongoose');
const validator = require('validator');
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Veuillez fournir votre adresse email'],
        validate: [validator.isEmail, 'Veuillez fournir une adresse email valide']
    },
    user_id: {
        type: String,
        require: true
    },
    created_by: {
        type: String,
        require: true
    },
    last_msg_date:Date
})

const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;