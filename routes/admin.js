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

router.get("/admin2", ensureAuthenticatedAdmin, async (req, res) => {});

router.get("/admin", async (req, res) => {
  var allusers = await User.find({});
  var allslots = await Slot.find({});
  var history = await History.find({}).populate("student").populate("slot");
  console.log(allusers);
  console.log(allslots);
  res.render("admin/index", { allusers: allusers, allslots: allslots, history:history });
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
      Slot.find({})
        .populate("students")
        .exec(function (err, allslots) {
          if (err) {
            console.log(err);
          } else {
            res.render("admin/slots", {
              allusers: allusers,
              allslots: allslots,
            });
          }
        });
    }
  });
});

router.get("/addslot", async (req, res) => {
  res.render("admin/addslot");
});

router.get("/slots/edit/:id", async (req, res) => {
  Slot.findById(req.params.id, async (err, foundCourse) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/slots/editslot", { Course: foundCourse });
    }
  });
});

router.post("/slots/edit/:id", async (req, res) => {
  console.log("UPDATE SLOT POST ROUTE HIT");
  // console.log(req.body);
  Slot.findByIdAndUpdate(req.params.id,req.body,function (err, modifiedCourse) {
      if (err) {
        console.log(err);
      } else {
        console.log(modifiedCourse);
        res.redirect("/slots");
      }
    }
  );
});

//POST REQUESTS

router.post("/addslot", async (req, res) => {
  console.log(req.body);
  Slot.create(req.body, function (err, newlycreateSlot) {
    if (err) {
      console.log(err);
      return res.json({ status: "Failed", msg: "Error creating slot" });
    } else {
      return res.json({ status: "Success", msg: "Slot successfully created" });
    }
  });
});

router.get("/scheduleslots/:id", async (req, res) => {
  var id = req.params.id;
  var choosenSlot = await Slot.findById(id).populate("students");
  User.find({}, function (err, allusers) {
    if (err) {
      console.log(err);
    } else {
      Slot.find({})
        .populate("students")
        .exec(function (err, allslots) {
          console.log(allslots);
          if (err) {
            console.log(err);
          } else {
            res.render("admin/slots/scheduleslots", {
              allusers: allusers,
              allslots: allslots,
              slot: choosenSlot,
            });
          }
        });
    }
  });
});

//POST TO DELETE STUDENT FROM SLOT
router.post("/slot/remove/student/:student_id/:slot_id", async (req, res) => {
  console.log("POST DELETE STUDENT FROM SLOT ROUTE HIT");
  console.log(req.params);
  var slot_id = req.params.slot_id;
  var student_id = req.params.student_id;
  var Slotselected = await Slot.findById(slot_id);
  var Studentselected = await User.findById(student_id);
  const index = Slotselected.students.indexOf(student_id);
  if (index > -1) {
    Slotselected.students.splice(index, 1);
  }
  Slotselected.save();
  console.log(Slotselected);
  console.log(Studentselected);
  res.redirect("/scheduleslots/" + slot_id);
});

//POST TO DELETE STUDENT FROM SLOT
router.post("/slot/add/student/:slot_id", async (req, res) => {
  var foundSlot = await Slot.findById(req.params.slot_id);
  console.log(foundSlot.students.indexOf(req.body.stname_id));
  console.log(foundSlot.students);
  console.log(req.body.stname_id);
  if (req.body.stname_id === "null") {
    req.flash("error_msg", "Please select a valid option");
    res.redirect("/scheduleslots/" + req.params.slot_id);
  } else if (foundSlot.students.length >= foundSlot.limit) {
    req.flash("error_msg", "Maximum limit has been reached");
    res.redirect("/scheduleslots/" + req.params.slot_id);
  } else if (foundSlot.students.indexOf(req.body.stname_id) > -1) {
    req.flash("error_msg", "The Student is already present in the slot");
    res.redirect("/scheduleslots/" + req.params.slot_id);
  } else {
    console.log("POST ADD STUDENT TO SLOT ROUTE HIT");
    var foundStudent = await User.findById(req.body.stname_id);
    console.log(foundSlot);
    console.log(foundStudent);
    var historyobj = {
      student:foundStudent._id,
      slot:foundSlot._id,
      mode:"Admin",
    }
    History.create(historyobj, async(err,newlyCreated) => {
      if(err)
      {
        console.log(err);
      }
      else
      { 
        console.log(newlyCreated);
      }
    });
    foundSlot.students.push(foundStudent);
    foundSlot.save();
    res.redirect("/scheduleslots/" + req.params.slot_id);
  }
});

router.post("/slots/delete/:slot_id", async (req, res) => {
  console.log(req.params);
  var id = req.params.slot_id;
  Slot.findByIdAndDelete(id, async (err, deletedSlot) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/slots");
    }
  });
});

router.get("/book/slots",ensureAuthenticated, async (req, res) => {
  console.log("**************************************");
  var date = new Date();
  var dateformat = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate();
  console.log(dateformat);
  console.log(date);
  var allslots = await Slot.find({});
  var dates = [];
  allslots.forEach(function (slot) {
    if (!dates.includes(slot.date)) {
      dates.push(slot.date);
    }
  });
  dates.sort((date1, date2) => {
    (date1 = date1.split("-")), (date2 = date2.split("-"));
    let day1 = parseInt(date1[2]);
    let day2 = parseInt(date2[2]);
    let month1 = parseInt(date1[1]);
    let month2 = parseInt(date2[1]);
    let year1 = parseInt(date1[0]);
    let year2 = parseInt(date2[0]);
    if (year1 !== year2) {
      return year1 - year2;
    } else if (month1 !== month2) {
      return month1 - month2;
    } else {
      return;
      day1 - day2;
    }
  });
  res.render("bookslots", { allslots: allslots, dates:dates });
});

//STUDENT ROUTES
router.post("/addslottostudent", ensureAuthenticated, async (req, res) => {
  console.log("BOOK SLOT ROUTE HIT");
  const userid = req.user._id;
  var slotid = req.body.slot_id;
  if(req.body.slot_id === "errorselectdefault")
  {
    return res.json({status:"Failed", msg:"Please select an option to proceed"});
  }
  var user = await User.findById({_id:userid});
  var slot = await Slot.findById({_id:slotid}).populate("students");
  if(user.slots.includes(slotid) || slot.students.includes(userid))
  {
    return res.json({status:"Failed", msg:"Slot has already been added"});
  }

  user.slots.push(slot._id);
  slot.students.push(user._id);
  user.save();
  slot.save();
  var historyobj = {
    student:user._id,
    slot:slot._id,
    mode:"Self",
  }
  History.create(historyobj, async(err,newlyCreated) => {
    if(err)
    {
      console.log(err);
    }
    else
    { 
      console.log(newlyCreated);
    }
  });
  return res.json({status:"Success", msg:"Successfully slot booked"});
});

module.exports = router;
