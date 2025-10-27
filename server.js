const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const path = require('path');
const userController = require('./controllers/users.js');
const courseController = require('./controllers/courses.js');
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

async function connect() {
    await mongoose.connect(process.env.MONGO_URI);
}

app.use("/", courseController);

app.use("/user", userController);

app.listen(3000, () => { console.log("Listening on port 3000.") });

connect().then(() => { console.log("Connected to Database.") })