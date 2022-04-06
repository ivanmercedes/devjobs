const mongoose = require("mongoose");
const User = mongoose.model("User");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");

const configMulter = {
  limits: { fileSize: 100000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "../../public/uploads/perfiles");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      // el callback se ejecuta como true o false : true cuando la imagen se acepta
      cb(null, true);
    } else {
      cb(new Error("Formato No Válido"));
    }
  },
};

const upload = multer(configMulter).single("image");

const uploadImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if(err.code ==='LIMIT_FILE_SIZE'){
          req.flash('error', 'El archivo es muy grande: Maximo 100kb')
          
        }else{
          req.flash('error', err.message)
        }
        return next();
      } else {
        req.flash("error", err.message);
        console.log(req.flash())
      }
      res.redirect("/dashboard");
      return;
    } else {
      next();
    }
  });
};

const formCreateUser = (req, res) => {
  res.render("create-user", {
    pageTitle: "Crea tu cuenta",
    tagLine:
      "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
  });
};

const ValidateUser = async (req, res, next) => {
  // Check
  await check("name", "El Nombre es Obligatorio")
    .notEmpty()
    .trim()
    .escape()
    .run(req);
  await check("email", "El E-Mail es Obligatorio")
    .isEmail()
    .normalizeEmail()
    .escape()
    .run(req);
  await check("password", "El password no puede ir vacio")
    .notEmpty()
    .trim()
    .escape()
    .run(req);
  await check("confirm", "Confirmar password no puede ir vacio")
    .notEmpty()
    .trim()
    .escape()
    .run(req);
  await check("confirm", "Los password no coinciden")
    .equals(req.body.password)
    .run(req);

  const errors = validationResult(req);
  if (errors.errors.length > 0) {
    // Set errors to flash messages
    req.flash(
      "error",
      errors.errors.map((error) => error.msg),
    );

    res.render("create-user", {
      pageTitle: "Crea tu cuenta",
      tagLine:
        "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
      messages: req.flash(),
    });

    return;
  }

  next();
};

const createUser = async (req, res, next) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.redirect("/iniciar-sesion");
  } catch (errors) {
    req.flash("error", errors);
    res.render("create-user", {
      pageTitle: "Crea tu cuenta",
      tagLine:
        "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
      messages: req.flash(),
    });
  }
};

const formLogin = (req, res) => {
  res.render("loginForm", {
    pageTitle: "Iniciar Sesion",
  });
};

const formEditAccount = (req, res) => {
  res.render("edit-account", {
    pageTitle: "Edita tu perfil",
    name: req.user.name,
    isAuthenticated: req.isAuthenticated(),
    user: req.user.toJSON(),
  });
};

const storeAccountUpdate = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name;
  user.email = req.body.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  if (req.file) {
    user.image = req.file.filename;
  }

  await user.save();

  req.flash("correcto", ["Cambios Guardados Correctamente"]);

  // Redirect
  return res.redirect("/dashboard");
};

const validateProfile = async (req, res, next) => {
  await check("name", "El Nombre es Obligatorio")
    .notEmpty()
    .trim()
    .escape()
    .run(req);
  await check("email", "El E-Mail es Obligatorio")
    .isEmail()
    .normalizeEmail()
    .escape()
    .run(req);

  if (req.body.password) {
    await check("password", "El password no puede ir vacio")
      .notEmpty()
      .trim()
      .escape()
      .run(req);
  }

  const errors = validationResult(req);

  if (errors.errors.length > 0) {
    req.flash(
      "error",
      errors.errors.map((error) => error.msg),
    );
    res.render("edit-account", {
      pageTitle: "Edita tu perfil",
      name: req.user.name,
      logout: true,
      isAuthenticated: req.isAuthenticated(),
      user: req.user.toJSON(),
      messages: req.flash(),
    });

    return;
  }

  next();
};

module.exports = {
  formCreateUser,
  createUser,
  ValidateUser,
  validateProfile,
  formLogin,
  formEditAccount,
  storeAccountUpdate,
  uploadImage,
};
