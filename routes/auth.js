const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var nodemailer = require('nodemailer');
require("dotenv").config();

var emailfrom = process.env.EMAIL_FROM;
var emailpassword = process.env.EMAIL_PASS;
var emailto = process.env.EMAIL_TO;
// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login.ejs");
});

router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("signup.ejs");
});

router.post("/register", forwardAuthenticated, (req, res) => {
  console.log(req.body);
  console.log("*************************************");
  const { username, email, age, instrument, password,phno } = req.body;
  let errors = [];

  if (!username || !email || !password || !age || !instrument || !phno) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    console.log(errors);
    console.log("*************************************2");
    res.render("signup", {
      errors,
      username,
      email,
      password,
      instrument,
      age,
      phno
    });
  } else {
    console.log("*************************************3");
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log("*************************************4");
        errors.push({ msg: "User already exists" });
        res.render("signup", {
          errors,
          username,
          email,
          age,
          password,
          instrument,
          phno
        });
      } else {
        console.log("*************************************5");
        const newUser = new User({
          username,
          email,
          age,
          instrument,
          password,
          phno,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            console.log(newUser);
            newUser
              .save()
              .then((user) => {
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  port: 465,
                  secure: true,
                  auth: {
                    user: emailfrom,
                    pass: emailpassword,
                  },
                });

                var mailOptions = {
                  from: emailfrom,
                  to: emailto,
                  subject: "Burntune: New Registration",
                  html:
                    '<html lang="en"><body><h2 style="text-align: center;">' +
                    req.body.name +
                    '</h2><h2 style="text-align: center;">' +
                    req.body.email +
                    '</h2><h2 style="text-align: center;">' +
                    req.body.age +
                    '</h2><h2 style="text-align: center;">'+
                    req.body.phno +
                    '</h2><h4 style="text-align: center;">' +
                    req.body.instrument +
                    "</h4></body></html>",
                };

                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Email sent: " + info.response);
                  }
                });

                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                console.log("8");
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//LOGIN ROUTE

router.post("/login", forwardAuthenticated, (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

module.exports = router;
