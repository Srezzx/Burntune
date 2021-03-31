const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');




router.get("/login",forwardAuthenticated, (req, res) => {
    res.render("login.ejs");
  });
  
  router.get("/register",forwardAuthenticated, (req, res) => {
    res.render("signup.ejs");
  });
  
  
  router.post("/register",forwardAuthenticated, (req, res) => {
    console.log(req.body);
    console.log("*************************************");
    const { username, email, age, instrument, password } = req.body;
    let errors = [];
  
    if (!username || !email || !password || !age || !instrument) {
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
            password,
            instrument
          });
        } else {
          console.log("*************************************5");
          const newUser = new User({
            username,
            email,
            age,
            instrument,
            password,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
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
  
  router.post('/login',forwardAuthenticated, (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
  
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
  

  module.exports = router;