const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var nodemailer = require('nodemailer');

// Load User model
const User = require("../models/User");
const Contact = require("../models/Contact");
var Slot = require("../models/slot");

require("dotenv").config();

var emailfrom = process.env.EMAIL_FROM;
var emailpassword = process.env.EMAIL_PASS;
var emailto = process.env.EMAIL_TO;



module.exports = router;
