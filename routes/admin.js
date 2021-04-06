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
const { ensureAuthenticated,forwardAuthenticated,ensureAuthenticatedAdmin } = require("../config/auth");

router.get("/admin",ensureAuthenticatedAdmin, async (req, res) => {
  User.find({}, function (err, allusers) {
    if (err) {
      console.log(err);
    } else {
        // console.log(allusers);
      res.render("admin" , {allusers:allusers});
    }
  });
});

module.exports = router;
