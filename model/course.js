const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    name: String,
    length: Number,
    url: String
});

const contentSchema = new mongoose.Schema({
    name: String,
    section: String,
    videos: [videoSchema]
});

const courseSchema = new mongoose.Schema({
    name: String,
    theme: String,
    content: [contentSchema]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;