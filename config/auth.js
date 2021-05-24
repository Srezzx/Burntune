module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log("2");
    console.log(req.user);
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/login");
  },
  ensureAuthenticatedAdmin: function (req, res, next) {
    console.log("1");
    console.log(req.user);
    if (req.isAuthenticated() && req.user.username === "burntune") {
      return next();
    }
    req.flash("error_msg", "Please log in as admin to view that resource");
    res.redirect("/login");
  },
  forwardAuthenticated: function (req, res, next) {
    console.log(req.user);
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
};
