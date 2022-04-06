const mongoose = require("mongoose");
const Job = mongoose.model("Job");
const passport = require("passport");
// const authenticatedUser = passport.authenticate("local", {
//   successRedirect: "/dashboard",
//   failureRedirect: "/iniciar-sesion",
//   failureFlash: true,
//   badRequestMessage: "Ambos campos son obligatorios",
// });

const authenticatedUser = (req, res, next) => {
  // console.log('===Request Session====',req.session)
  passport.authenticate(
    "local",
    {
      successRedirect: "/dashboard",
      failureRedirect: "/Iniciar Sesion",
      badRequestMessage: "Ambos campos son obligatorios",
      session: true,
    },
    function (err, user, errorCallback) {
      if (errorCallback) {
        req.flash(
          "error",
          Object.keys(errorCallback) == "message"
            ? [errorCallback.message]
            : errorCallback,
        );
        return res.render("loginForm", {
          pageTitle: "Iniciar Sesion",
          messages: req.flash(),
        });
      }

      if (!user) return res.redirect("/iniciar-sesion");

      req.logIn(user, function (loginError) {
        if (loginError) {
          console.log(
            "error on auth.controller.js post /login loginError",
            loginError,
          );
          return loginError;
        }
        req.session.save(() => res.redirect("/dashboard"));
      });
    },
  )(req, res, next);
};

const dashboard = async (req, res) => {
  const vacancies = await Job.find({ author: req.user._id }).lean();
  res.render("dashboard", {
    pageTitle: "Dashboard",
    tagLine: "Crea y Administa tus vacantes desde aqui",
    // name: req.user.name,
    // imagen: req.user.image,
    isAuthenticated: req.isAuthenticated(),
    vacancies,
    messages: req.flash(),
  });
};

const logOut = (req, res) => {
  req.logout();
  console.log( req.logout())
  return res.redirect("/iniciar-sesion");
};
module.exports = {
  authenticatedUser,
  dashboard,
  logOut,
};
