const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var nodemailer = require("nodemailer");
// Load User model
const User = require("../models/User");
const Contact = require("../models/Contact");
const History = require("../models/History");
const { ensureAuthenticated } = require("../config/auth");
require("dotenv").config();

var emailfrom = process.env.EMAIL_FROM;
var emailpassword = process.env.EMAIL_PASS;
var emailto = process.env.EMAIL_TO;

router.get("/profile/:id", ensureAuthenticated, async (req, res) => {
  var id = req.params.id;
  var history = await History.find({}).populate("student").populate("slot");
  history = history.filter(function (entity) {
    if (entity.student._id.toString() === req.user._id.toString()) {
      return entity;
    }
  });
  User.findById(id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render("profile", { profile: foundUser, history: history });
    }
  });
});

router.get("/contactus", (req, res) => {
  res.render("contactus");
});

router.post("/contactme", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.phno ||
    !req.body.message
  ) {
    return res.json({ status: "Failed", msg: "Please enter all the fields" });
  }
  Contact.create(req.body, function (err, newlyCreated) {
    if (err) {
      console.log(err);
      return res.json({
        status: "Failed",
        msg: "Execution Failed, Contact us or please try again later",
      });
    } else {
      console.log(newlyCreated);

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
        subject: "Burntune: Someone contacted us",
        html:
          '<html lang="en"><body><h2 style="text-align: center;">' +
          req.body.name +
          '</h2><h2 style="text-align: center;">' +
          req.body.email +
          '</h2><h2 style="text-align: center;">' +
          req.body.phno +
          '</h2><h4 style="text-align: center;">' +
          req.body.message +
          "</h4></body></html>",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.json({ status: "Success", msg: "Message successfully sent" });
    }
  });
});

// router.get("/test", async(req,res) => {
//   res.render("category");
// });

// router.get("/test2", async(req,res) => {
//   res.render("blog");
// });

// router.get("/test3", async(req,res) => {
//   res.render("artist");
// });

// router.get("/test4", async(req,res) => {
//   res.render("playlist");
// });

module.exports = router;
