const express = require('express');
const router = express.Router();

const Course = require('../model/course.js');

const User = require('../model/user.js');
const e = require("express");

router.get('/', async (req, res) => {
    let courses = await randomizedCourses();
    let money = 0;
    if(req.session.user) {
        let user = await User.findById(req.session.user._id);
        money = user.funds;
    }
    res.render("../views/home/index.ejs", { courses: courses, user: req.session.user, funds: money});
});

router.get('/view/:courseId', async (req, res) => {
    let user = await User.findById(req.session.user._id);
    let course = await Course.findById(req.params.courseId);
    let owns;
    user.ownedCourses.forEach((entry) => {
       if(entry.toString() === course.id) {
           owns = true;
       }
    });
    if(owns) {
        res.render("../views/course-area/course.ejs", { course: course, user: req.session.user, owns: true, funds: user.funds });
    }else {
        res.render("../views/course-area/course.ejs", { course: course, user: req.session.user, owns: false, funds: user.funds });
    }
});

router.get('/edit-courses', async (req, res) => {
    let user = await User.findById(req.session.user._id);
    if(user.type === "instructor") {
        let coursesForEdit = [];
        for(let i = 0; i < user.ownedCourses.length; i++) {
            let course = await Course.findById(user.ownedCourses[i].toString());
            if(course !== null) {
                course.instructors.forEach((entry) => {
                    if(entry.toString() === req.session.user._id) {
                        coursesForEdit.push(course);
                    }
                });
            }
        }
        res.render("../views/course-area/edit-courses.ejs", {courses: coursesForEdit, user: user, funds: user.funds})
    }else {
        res.redirect("/");
    }
})

router.get('/new-course', async (req, res) => {
    let user = await User.findById(req.session.user._id);
    if(user.type === 'instructor') {
        res.render("../views/course-area/new-course.ejs");
    }else {
        res.redirect("/");
    }
});

router.get('/content-manager/:courseId', async (req, res) => {
    let course = await Course.findById(req.params.courseId);
    let isInstructor = false;
    course.instructors.forEach((instructor) => {
        if(instructor.toString() === req.session.user._id) {
            isInstructor = true;
        }
    });
    if(isInstructor) {
        res.render("../views/course-area/add-content.ejs", {course: course, user: req.session.user});
    }else {
        res.redirect("/");
    }
});

router.put('/add-content/:courseId', async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    let data;

    for(const [key, value] of Object.entries(req.body)) {
        data = JSON.parse("[" + key + "]");
    }

    if(course !== null) {
        let content = [];
        data.forEach((entry) => {
            content.push(entry);
        })

        course.content = content;

        let savedCourse = await course.save();

        res.redirect("/view/" + savedCourse.id);
    }
});

router.get('/my-courses', async (req, res) => {
    let user = await User.findById(req.session.user._id);
    let ownerCourses = [];
    for(let i = 0; i < user.ownedCourses.length; i++) {
        ownerCourses.push(await Course.findById(user.ownedCourses[i]));
    }
    ownerCourses = ownerCourses.filter(n => n);
    res.render("../views/course-area/my-courses.ejs", {courses: ownerCourses, user: user, funds: user.funds})
});

router.get('/watch/:courseId/:contentId/:videoId', async (req, res) => {
    let course = await Course.findById(req.params.courseId);
    let user = await User.findById(req.session.user._id);
    let owns;
    user.ownedCourses.forEach((entry) => {
        if(entry.toString() === course.id) {
            owns = true;
        }
    })
    if(owns) {
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
        res.render("../views/course-area/watch-video.ejs", { content: content, videoName: video.name, videoUrl: video.url, courseName: course.name })
    }else {
        res.redirect("/");
    }
});

router.post('/create', async (req, res) => {
    let name = req.body.name;
    let theme = req.body.theme;
    let content = [];

    const course = { name: name,
                          theme: theme,
                          instructors: [req.session.user._id],
                          content: content };

    let created= await Course.create(course);

    res.redirect("/view/" + created.id);
});

router.get('/deposit', async (req, res) => {
    let user = await User.findById(req.session.user._id);
    res.render("../views/client-area/deposit.ejs", {user: user});
});


router.get('/buy/:courseId', async (req, res) => {
   let user = await User.findById(req.session.user._id);
   let course = await Course.findById(req.params.courseId);
   if(user.funds >= course.price) {
       user.ownedCourses.push(course.id);

       user.funds -= course.price;

       console.log("bought");

       await user.save();
   }

   res.redirect("/view/" + course.id);
});

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