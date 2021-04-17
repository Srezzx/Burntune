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
const {
  ensureAuthenticated,
  forwardAuthenticated,
  ensureAuthenticatedAdmin,
} = require("../config/auth");

router.get("/admin2", ensureAuthenticatedAdmin, async (req, res) => {});

router.get("/admin", async (req, res) => {
  User.find({}, function (err, allusers) {
    if (err) {
      console.log(err);
    } else {
      // console.log();
      res.render("admin/index", { allusers: allusers });
    }
  });
});

router.get("/admin/allregs", async (req, res) => {
  User.find({}, function (err, allusers) {
    if (err) {
      console.log(err);
    } else {
      // console.log();
      res.render("admin/allregs", { allusers: allusers });
    }
  });
});
router.get("/tables", async (req, res) => {
  res.render("admin/tables");
});
router.get("/typography", async (req, res) => {
  res.render("admin/typography");
});
router.get("/icons", async (req, res) => {
  res.render("admin/icons");
});
router.get("/charts", async (req, res) => {
  res.render("admin/charts");
});
router.get("/elements", async (req, res) => {
  res.render("admin/elements");
});
router.get("/notifications", async (req, res) => {
  res.render("admin/notifications");
});
router.get("/page-lockscreen", async (req, res) => {
  res.render("admin/page-lockscreen");
});
router.get("/page-login", async (req, res) => {
  res.render("admin/page-login");
});

router.get("/page-profile", async (req, res) => {
  res.render("admin/page-profile");
});
router.get("/panels", async (req, res) => {
  res.render("admin/panels");
});

router.get("/slots", async (req, res) => {
  User.find({}, function (err, allusers) {
    if (err) {
      console.log(err);
    } else {
      Slot.find({}, function (err,allslots){ 
        if(err)
        {
          console.log(err);
        }
        else
        {
          res.render("admin/slots", { allusers: allusers, allslots:allslots });
        }
      });
    }
  });
});

router.get("/addslot", async(req,res) =>{
  res.render("admin/addslot");
});



//POST REQUESTS

router.post("/addslot" , async(req,res) => {
  console.log(req.body);
  Slot.create(req.body , function(err,newlycreateSlot) {
    if(err)
    {
      console.log(err);
      return res.json({ status: "Failed", msg: "Error creating slot" });
    }
    else
    {
      return res.json({ status: "Success", msg: "Slot successfully created" });
    }
  });
  
});
module.exports = router;
