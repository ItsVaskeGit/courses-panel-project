const express = require('express');
const router = express.Router();

const User = require('../model/user.js');
const bcrypt = require("bcrypt");

router.get('/',  async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render("../views/client-area/user.ejs", {user: user});
});

router.get('/change/', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    if(user !== null) {
        res.render("../views/client-area/change-details.ejs", {user: user});
    }
});

router.put('/deposit', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    if(user !== null) {

        user.funds += Number(req.body.amount);

        await user.save();
    }

    res.redirect("/");
});

router.put('/details/', async (req, res) => {
   const user = await User.findById(req.session.user._id);

   user.username = req.body.username;

   if(req.body.password) {
       user.password = bcrypt.hashSync(req.body.password, 10);
   }

   user.type = req.body.type;

   await user.save();

   res.redirect("/");
});

module.exports = router;