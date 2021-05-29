var express = require("express");
var methodOverride = require("method-override");
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");
const flash = require("connect-flash");
var bcrypt = require("bcryptjs");
require("dotenv").config();
const session = "express-session";
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

//MODELS
var User = require("./models/User");
var Contact = require("./models/Contact");
var Slot = require("./models/slot");

//DATABASE CONNECTION
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
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
  res.locals.success_msg = req.flash("success_msg");
  res.locals.success_msg_modal = req.flash("success_msg_modal");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//ROUTES
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/index"));
app.use("/", require("./routes/admin"));
// app.use("/", require("./routes/slot"));
// app.use("/", require("./routes/scheduler"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/:random", (req, res) => {
  res.redirect("/");
});

// app.get("/scheduletest", async (req,res) => {
//   console.log(req.body);
//   return res.json({msg:"Success"});
// });

app.listen(process.env.PORT || 3000, process.env.ID, function (req, res) {
  console.log("Server has started for Papaspot at PORT 3000");
});
