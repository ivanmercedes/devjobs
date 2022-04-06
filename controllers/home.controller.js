const mongoose = require("mongoose");
const Job = mongoose.model("Job");

exports.showJobs = async (req, res, next) => {
  const vacancies = await Job.find().lean();
  if (!vacancies) return next();

  res.render("home", {
    pageTitle: "DevJobs",
    tagLine: "Encuentra y publica nuevas vacantes para desarrolladores.",
    button: true,
    logout: true,
    isAuthenticated: req.isAuthenticated(),
    vacancies,
  });
};
