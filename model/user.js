const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: String,
    required: Boolean
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: typeSchema,
    ownedCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;