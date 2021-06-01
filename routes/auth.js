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

router.post("/register", forwardAuthenticated, async (req, res) => {
  console.log(req.body);
  const {
    name,
    username2: username,
    email,
    age,
    instrument,
    password,
    phno: phone,
  } = req.body;
  let errors = [];
  var usernamelower = username2.toLowerCase();
  if (!usernamelower || !email || !password || !name) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.json({ status: "Error", msg: "Please enter all the nessesary fields" });
  } else {
    var user2 = await User.findOne({ username: usernamelower });
    await User.findOne({ email: email }).then(async (user) => {
      if (user || user2) {
        errors.push({ msg: "User already exists" });
        res.json({
          status: "Error",
          msg: "User already exists, please try using another email or username",
        });
      } else {
        const newUser = new User({
          joinDate: new Date(),
          name,
          usernamelower,
          email,
          password,
          phno,
        });
        console.log(newUser);
        bcrypt.genSalt(10, async (err, salt) => {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(async (user) => {
                console.log("Prepare to send new registration email");
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  port: 465,
                  secure: false,
                  ignoreTLS: true,
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
                    req.body.usernamelower +
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
                console.log("reeached here - 1");
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Email sent: " + info.response);
                  }
                });
                const histobj = await new History({
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
    console.log(email_route);
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
        '<html lang="en"><body><p style="text-align: left;">Please click here to reset your burntune account password<br>' +
        '<a href="' +
        email_route +
        '">Here</a>' +
        '</p><br><br><p style="text-align:center">If you did not request for this request for this password change, please ignore this email</p></body></html>',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.json({
          status: "Error",
          msg: "Could not send email, plese try again in sometime",
        });
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

router.get("/forgotpassword/:user_id/:unique_id", async (req, res) => {
  var user = await User.findById(req.params.user_id);
  var current_Date = new Date();
  var past_Date = new Date(user.forgetPassTime);
  var minutes_diff = (current_Date.getTime() - past_Date.getTime()) / 60000;
  console.log(minutes_diff);

  if (user && user.forgetPassString) {
    if (user.forgetPassString === req.params.unique_id && minutes_diff <= 30) {
      res.render("forgotpass", {
        user,
        minutes_diff,
        past_Date,
      });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

router.post("/forgotpassword/final", async (req, res) => {
  console.log("Forgot Password final route");
  console.log(req.body);
  var user_id = req.body.user_id;
  var user = await User.findById(user_id);
  console.log(user);

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
        throw err;
      }
      newP = hash;
      console.log(user.password);
      user.password = newP;
      user.save();
      console.log(user);
      console.log(newP);
    });
  });
  return res.json({ status: "Success", msg: "Password successfully changed" });
});
module.exports = router;
