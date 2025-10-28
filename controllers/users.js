const express = require('express');
const router = express.Router();

const User = require('../model/user.js');

router.get('/',  async (req, res) => {
    const user = await User.findById(req.session.user._id);
    if(user !== null) {
        res.render("../views/client-area/user.ejs", {user: user});
    }else {
        res.render("../views/client-area/user.ejs", {message: "User does not exist."})
    }
});

router.get('/change/', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    if(user !== null) {
        res.render("../views/client-area/change-details.ejs", {user: user});
    }
})

module.exports = router;