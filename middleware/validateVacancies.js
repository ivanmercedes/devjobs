const { check, validationResult } = require("express-validator");

const validateVacancy = async (req, res, next) => {
  await check("title", "El Titulo es Obligatorio")
    .notEmpty()
    .trim()
    .escape()
    .run(req);
  await check("company", "Agrega una Empresa2")
    .notEmpty()
    .trim()
    .escape()
    .run(req);
  await check("location", "La ubicacion es obligatoria")
    .notEmpty()
    .trim()
    .escape()
    .run(req);
  await check("contract", "Selecciona el tipo de Contrato")
    .notEmpty()
    .trim()
    .escape()
    .run(req);
  await check("skills", "Agrega al menos una habilidad")
    .notEmpty()
    .trim()
    .escape()
    .run(req);

  const errors = validationResult(req);

  if (errors.errors.length > 0) {
    req.flash(
      "error",
      errors.errors.map((error) => error.msg),
    );

    res.render("create-vacancies-form", {
      pageTitle: "Creando una Nueva Vacante",
      tagLine: "Llena el formulario y publcia tu vacante",
      name: req.user.name,
      logout: true,
      messages: req.flash(),
    });

    return;
  }

  next();
};

module.exports = {
  validateVacancy,
};
