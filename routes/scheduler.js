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
const Slot = require("../models/slot");
const History = require("../models/History");
const {
  ensureAuthenticated,
  forwardAuthenticated,
  ensureAuthenticatedAdmin,
} = require("../config/auth");

router.get("/filterallslots", async (req, res) => {
  var TD = new Date();
  var currentDate =
    TD.getFullYear() +
    "-" +
    ("0" + (TD.getMonth() + 1)).slice(-2) +
    "-" +
    TD.getDate();
  function oneGreaterThanTwo(dd1, dd2) {
    var date1 = dd1;
    var date2 = dd2;
    date1 = date1.split("-");
    date2 = date2.split("-");
    let day1 = parseInt(date1[2]);
    let day2 = parseInt(date2[2]);
    let month1 = parseInt(date1[1]);
    let month2 = parseInt(date2[1]);
    let year1 = parseInt(date1[0]);
    let year2 = parseInt(date2[0]);
    if (year1 > year2) {
      return true;
    } else if (year1 < year2) {
      return false;
    } else if (year1 === year2) {
      if (month1 > month2) {
        return true;
      } else if (month1 < month2) {
        return false;
      } else if (month1 === month2) {
        if (day1 > day2) {
          return true;
        } else if (day1 < day2) {
          return false;
        } else if (day1 === day2) {
          return false;
        }
      }
    }
  }
  Slot.find({}, async (err, allslots) => {
      console.log(allslots);
    if (err) {
      console.log(err);
    } else {
      var allslots = allslots.filter(function (slot) {
        if (oneGreaterThanTwo(slot.date, currentDate)) {
          return slot;
        }
      });
      console.log(newslots);
      allslots.save();
    }
  });
});

module.exports = router;
