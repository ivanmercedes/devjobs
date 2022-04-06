const passport = require("passport");
const locaStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Users = mongoose.model("User");

passport.use(
  new locaStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      Users.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Usuario no existente" });
        }
        if (!user.comparedPassword(password)) {
          return done(null, false, { message: "Credenciales Incorrectos" });
        }
        return done(null, user);
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Users.findById(id).exec();
  return done(null, user);
});

module.exports = passport;
