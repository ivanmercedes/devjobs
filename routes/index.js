const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");
const jobsController = require("../controllers/job.controller");
const usersController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const { checkIfAuthenticated } = require("../middleware/isAuth");
const { validateVacancy } = require("../middleware/validateVacancies");

module.exports = () => {
  router.get("/", homeController.showJobs);

  // Create vacancies
  router.get(
    "/vacantes/nueva",
    checkIfAuthenticated,
    jobsController.createForm,
  );
  router.post(
    "/vacantes/nueva",
    checkIfAuthenticated,
    validateVacancy,
    jobsController.addJob,
  );

  // Show vacancies ( singular )
  router.get("/vacantes/:url", jobsController.showJob);

  // Edit Job
  router.get(
    "/vacantes/editar/:url",
    checkIfAuthenticated,
    jobsController.formEditJob,
  );
  router.post(
    "/vacantes/editar/:url",
    checkIfAuthenticated,
    validateVacancy,
    jobsController.editJob,
  );

   // Delete vacancies ( singular )
   router.delete('/vacantes/eliminar/:id',
   jobsController.deleteJob
   )

  // Register
  router.get("/crear-cuenta", usersController.formCreateUser);
  router.post(
    "/crear-cuenta",
    usersController.ValidateUser,
    usersController.createUser,
  );

  // Login
  router.get("/iniciar-sesion", usersController.formLogin);
  router.post("/iniciar-sesion", authController.authenticatedUser);
  router.get("/cerrar-sesion", checkIfAuthenticated, authController.logOut);

  // Dashboard
  router.get("/dashboard", checkIfAuthenticated, authController.dashboard);

  // Edit accout
  router.get(
    "/editar-perfil",
    checkIfAuthenticated,
    usersController.formEditAccount,
  );
  router.post(
    "/editar-perfil",
    checkIfAuthenticated,
    // usersController.validateProfile,
    usersController.uploadImage,
    usersController.storeAccountUpdate,
  );

  // Send CV
  router.post('/vacantes/:url', jobsController.uploadCV, jobsController.contactJob)

  return router;
};
