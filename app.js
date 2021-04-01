var express = require("express");
var methodOverride = require("method-override");
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const {ensureAuthenticated,forwardAuthenticated } = require("./config/auth");
const flash = require("connect-flash");
var bcrypt = require('bcryptjs');
require("dotenv").config();
const session = ("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var app = express();
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: true,
  })
);


// Connect flash
app.use(flash());

//PASSPORT CONFIG
require("./config/passport")(passport);

app.use(
  require("express-session")({
    secret: "Demons run when a good man goes to war",
    resave: true,
    saveUninitialie: true,
  })
);

const db = process.env.MONGOURI;
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/images"));

var User = require("./models/User");

//DATABASE CONNECTION
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("Error", err.message);
  });

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//ROUTES
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/index'));

app.get("/", (req, res) => {
  res.render("index.ejs" );
});

app.listen(process.env.PORT || 3000, process.env.ID, function (req, res) {
  console.log("Server has started for Papaspot at PORT 3000");
});