const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const path = require('path');
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

async function connect() {
    await mongoose.connect(process.env.MONGO_URI);
}

app.get("/", (req, res) => {
    res.render("./views/home/index.ejs");
});



app.listen(3000, () => { console.log("Listening on port 3000.") });

connect().then(() => { console.log("Connected to Database.") })