const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const userController = require('./controllers/users.js');
const courseController = require('./controllers/courses.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const authController = require('./controllers/auth.js');
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

async function connect() {
    await mongoose.connect(process.env.MONGO_URI);
}

app.use("/", courseController);

app.use("/user", userController);

app.use("/auth", authController);

app.use(passUserToView);

app.use(isSignedIn)

app.listen(3000, () => { console.log("Listening on port 3000.") });

connect().then(() => { console.log("Connected to Database.") })