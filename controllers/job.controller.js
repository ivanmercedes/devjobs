const mongoose = require("mongoose");
const Job = mongoose.model("Job");

const multer = require("multer");
const shortid = require("shortid");

const createForm = (req, res) => {
  res.render("create-vacancies-form", {
    pageTitle: "Creando una Nueva Vacante",
    tagLine: "Llena el formulario y publcia tu vacante",
    name: req.user.name,
    isAuthenticated: req.isAuthenticated(),
    logout: true,
  });
};

// Add a new Job to the database
const addJob = async (req, res) => {
  const job = new Job(req.body);

  // Author of the Job
  job.author = req.user._id;
  // create Skill Array
  job.skills = req.body.skills.split(",");

  // Store on the database
  const newJob = await job.save();

  // Redirect
  res.redirect(`/vacantes/${newJob.url}`);
};

const showJob = async (req, res, next) => {
  const job = await Job.findOne({ url: req.params.url })
    .populate("author")
    .lean();
  if (!job) next();

  res.render("viewJob", {
    job,
    pageTitle: job.title,
    isAuthenticated: req.isAuthenticated(),
    bar: true,
  });
};

const formEditJob = async (req, res, next) => {
  const job = await Job.findOne({ url: req.params.url }).lean();

  if (!job) next();

  res.render("edit-job", {
    job,
    pageTitle: `Editar - ${job.title}`,
    name: req.user.name,
    isAuthenticated: req.isAuthenticated(),
    logout: true,
  });
};

const editJob = async (req, res, next) => {
  const updateJob = req.body;
  updateJob.skills = req.body.skills.split(",");

  const job = await Job.findOneAndUpdate(
    { url: req.params.url },
    updateJob,
    {
      new: true,
      runValidators: true,
    },
  );

  res.redirect(`/vacantes/${job.url}`);
};

const deleteJob = async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (verifyAuthor(job, req.user)) {
    job.remove();
    res.status(200).send("Vacante eliminada Correctamente");
  } else {
    res.status(403).send("Error");
  }
};

const verifyAuthor = (job = {}, user = {}) => {
  if (!job.author.equals(user._id)) {
    return false;
  }

  return true;
};

const uploadCV = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El archivo es muy grande: Maximo 100kb");
        } else {
          req.flash("error", err.message);
        }
        return next();
      } else {
        req.flash("error", err.message);
      }
      res.redirect("/back");
      return;
    } else {
      next();
    }
  });
};

const configMulter = {
  limits: { fileSize: 100000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "../../public/uploads/cv");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "application/pdf") {
      // el callback se ejecuta como true o false : true cuando la imagen se acepta
      cb(null, true);
    } else {
      cb(new Error("Formato No Válido"));
    }
  },
};

const upload = multer(configMulter).single("cv");

const contactJob = (req, res, next) => {
  // store candidate on db
};

module.exports = {
  createForm,
  addJob,
  showJob,
  formEditJob,
  editJob,
  deleteJob,
  uploadCV,
  contactJob,
};
