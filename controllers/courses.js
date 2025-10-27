const express = require('express');
const router = express.Router();

const Course = require('../model/course.js');

const User = require('../model/user.js');

router.get('/', (req, res) => {
    res.render("../views/home/index.ejs", { courses: randomizedCourses() });
});

router.get('/:courseId', async (req, res) => {
    let course = Course.findById(req.params.courseId);
    res.render("../views/course-area/course.ejs", { course: course });
});

router.get('/watch/:courseId', async (req, res) => {
    let course = await Course.findById(req.params.courseId);
    res.render("../views/course-area/watch-content.ejs", { course: course });
});

router.get('/watch/:courseId/:contentId/:videoId', async (req, res) => {
    let course = await Course.findById(req.params.courseId);
    let user = await User.findById(req.session.user._id);
    if(course in user.ownedCourses) {
        let content = {};
        let video = {};
        course.content.forEach((entry) => {
            if(entry.id === req.params.contentId) {
                content = entry;
            }
        });
        if(content !== {}) {
            content.videos.forEach((entry) => {
                if(entry.id === req.params.videoId) {
                    video = entry;
                }
            });
        }
        res.render("../views/course-area/watch-video.ejs", { content: content, videoUrl: video.url, courseName: course.name })
    }else {
        res.render("../views/course-area/watch-video.ejs", { message: "User does not own the course therefore the content is inaccessible." });
    }
})

const randomizedCourses = async () => {
    const courses = await Course.find({});

    let counter = 0;
    const courseLimit = 10;
    let randomCourses = [];

    for(let i = 0; i < courses.length; i++) {
        let random = Math.round(Math.random());
        if(random === 1) {
            if(counter <= courseLimit) {
                counter++;
                randomCourses.push(courses[i]);
            }else {
                break;
            }
        }
    }

    return randomCourses;
}

module.exports = router;