const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var nodemailer = require("nodemailer");
require("dotenv").config();

var emailfrom = process.env.EMAIL_FROM;
var emailpassword = process.env.EMAIL_PASS;
var emailto = process.env.EMAIL_TO;
// Load User model
const User = require("../models/User");
const History = require("../models/History");
const { forwardAuthenticated } = require("../config/auth");

// router.get("/login", forwardAuthenticated, (req, res) => {
//   res.render("login.ejs");
// });

// router.get("/register", forwardAuthenticated, (req, res) => {
//   res.render("signup.ejs");
// });

router.post("/register", forwardAuthenticated, (req, res) => {
  console.log(req.body);
  const { name, username, email, age, instrument, password, phno } = req.body;
  let errors = [];

  if (!username || !email || !password || !name) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.json({ status: "Error", msg: "Please enter all the nessesary fields" });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "User already exists" });
        res.json({
          status: "Error",
          msg: "User already exists, please try using another email",
        });
      } else {
        const newUser = new User({
          joinDate: new Date(),
          name,
          username,
          email,
          password,
          phno,
        });
        console.log(newUser);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(async (user) => {
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
                    req.body.username +
                    '</h2><h2 style="text-align: center;">' +
                    req.body.email +
                    '</h2><h2 style="text-align: center;">' +
                    req.body.age +
                    '</h2><h2 style="text-align: center;">' +
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
                const histobj = new History({
                  student: newUser._id,
                  mode: "Registration",
                  time: new Date(),
                });
                histobj.save();
                res.json({
                  status: "Success",
                  msg: "You have been successfully registered",
                });
              })
              .catch((err) => {
                res.json({
                  status: "Failed",
                  msg: "Account could not be created, please try after sometime",
                });
                console.log(err);
              });
          });
        });
      }
    });
  }
});

//LOGIN ROUTE

// router.post("/login", forwardAuthenticated, (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/",
//     failureFlash: true,
//     failWithError: true,
//   })(req, res, next);
// });
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.json({ status: "Failed", msg: err });
    }
    if (!user) {
      return res.json({
        status: "Error",
        msg: "Invalid login credentials, please try again",
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        status: "Success",
        msg: "You have been successfully logged in",
        userid: user._id,
      });
    });
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

router.post("/forgotpassword", async (req, res) => {
  console.log("Forgot password route hit");
  var time = new Date();
  function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  var hash = randomString(
    30,
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  );
  var email = req.body.forgot_email;
  var foundUser = await User.find({ email: email });
  try {
    foundUser[0].forgetPassTime = time;
    foundUser[0].forgetPassString = hash;
    foundUser[0].save();
    var email_route =
      "https://burntune.com/forgotpassword/" + foundUser[0]._id + "/" + hash;
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
      to: email,
      subject: "Burntune account Password reset ",
      html:
        '<html lang="en"><body><h2 style="text-align: center;">Please click here to reset your burntune account password<br>' +
        '<a href="' +
        email_route +
        '">Here</a>' +
        "</h2>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({
          status: "Error",
          msg: "Could not send email, plese try again in sometime",
        });
        console.log(error);
      } else {
        res.json({
          status: "Success",
          msg: "Reset Email sent to the entered Email ID",
        });
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    return res.json({
      status: "Error",
      msg: "Email ID not registered, Register NOW!",
    });
  }
});

module.exports = router;
