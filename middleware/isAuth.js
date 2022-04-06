const checkIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // redirect to login
  res.redirect("/iniciar-sesion");
};

// const is
module.exports = {
  checkIfAuthenticated,
};
