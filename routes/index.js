const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var nodemailer = require('nodemailer');
// Load User model
const User = require("../models/User");
const Contact = require("../models/Contact");
require("dotenv").config();

var emailfrom = process.env.EMAIL_FROM;
var emailpassword = process.env.EMAIL_PASS;
var emailto = process.env.EMAIL_TO;

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

module.exports = router;
