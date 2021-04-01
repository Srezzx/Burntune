const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');


router.get("/contactus", (req,res) => {
    res.render("contactus");
});


  module.exports = router;