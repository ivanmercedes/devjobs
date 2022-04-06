import "./app.scss";

import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");

  let alerts = document.querySelector(".alertas");

  if (alerts) {
    clearAlerts(alerts);
  }

  if (skills) {
    skills.addEventListener("click", addSkills);
    // when is on edit mode
    selectedSkills();
  }

  const vacanciesList = document.querySelector(".panel-administracion");

  if (vacanciesList) {
    vacanciesList.addEventListener("click", actionsList);
  }
});

const skills = new Set();

const addSkills = (e) => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      skills.delete(e.target.textContent);
      e.target.classList.remove("activo");
    } else {
      skills.add(e.target.textContent);
      e.target.classList.add("activo");
    }
  }

  const skillArray = [...skills];
  document.getElementById("skills").value = skillArray;
};

const selectedSkills = () => {
  const selecteds = Array.from(
    document.querySelectorAll(".lista-conocimientos .activo"),
  );

  selecteds.forEach((selected) => {
    skills.add(selected.textContent);
  });

  const skillArray = [...skills];
  document.getElementById("skills").value = skillArray;
};

const clearAlerts = (element) => {
  const interval = setInterval(() => {
    if (element.children.length > 0) {
      element.removeChild(element.children[0]);
    } else if (element.children.length === 0) {
      element.parentElement.removeChild(element);
      clearInterval(interval);
    }
  }, 2000);
};

// Delete vacancies from db
const actionsList = (e) => {
  if (e.target.dataset.delete) {
    e.preventDefault();
    Swal.fire({
      title: "Confirmar Eliminacion?",
      text: "Una vez eliminada, no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No",
    })
      .then((result) => {
        if (result.isConfirmed) {
          // Send request axios
          const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.delete}`;

          axios.delete(url, { params: { url } }).then((response) => {
            if (response.status === 200) {
              Swal.fire("Borrado!", response.data, "success");

              // DELETE from DOM
              e.target.parentElement.parentElement.parentElement.removeChild(
                e.target.parentElement.parentElement,
              );
            }
          });
        }
      })
      .catch(() => {
        Swal.fire("error", {
          title: "Hubo un error",
          text: "No se pudo elimiar",
        });
      });
  }
};
