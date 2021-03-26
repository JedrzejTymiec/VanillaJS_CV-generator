import BasicForm from "./views/BasicForm.js";
import ExperienceForm from "./views/ExperienceForm.js";
import SkillsForm from "./views/SkillsForm.js";
import Download from "./views/Download.js";
import modalUI from "./modalUI.js";
import appUI from "./appUI.js";
import experienceCRUD from "./CRUD/experienceCRUD.js";
import educationCRUD from "./CRUD/educationCRUD.js";
import certificationCRUD from "./CRUD/certificationCRUD.js";
import basicDataCRUD from "./CRUD/basicDataCRUD.js";
import langSkillCRUD from "./CRUD/languageSkillsCRUD.js";
import completeCvCRUD from "./CRUD/completeCvCRUD.js";
import validation from "./validation.js";
import photoCRUD from "./CRUD/photoCRUD.js";
import { photoUpload, toggle, toggleHandle } from "./photoUpload.js";
import projectsCRUD from "./CRUD/projectsCRUD.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  window.scroll(0, 0);
  router();
};

const router = async () => {
  const routes = [
    { path: "/app/basic", view: BasicForm },
    { path: "/app/experience", view: ExperienceForm },
    { path: "/app/skills", view: SkillsForm },
    { path: "/app/download", view: Download },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  const view = new match.route.view();

  document.querySelector("#form-container").innerHTML = await view.getHtml();

  let currentPage = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );
  appUI.pagesDone(currentPage);

  photoCRUD.readPhoto();
  basicDataCRUD.readBasicData();
  basicDataCRUD.readResidenceData();
  basicDataCRUD.readContactData();

  if (document.getElementById("form-container").dataset.valid === "false") {
    validation.validateBasicPage();
  }

  langSkillCRUD.readLanguages();
  langSkillCRUD.readSkills();
  experienceCRUD.readExperience();
  educationCRUD.readEducation();
  certificationCRUD.readCertification();
  projectsCRUD.readProjects();

  completeCvCRUD.readCv();

  //Close modal

  let closeModalButtons = document.getElementsByClassName("close-modal");

  for (var i = 0; closeModalButtons.length > i; i++) {
    closeModalButtons[i].addEventListener("click", (e) => {
      modalUI.closeModal(e.target);
      modalUI.clearInputs(e.target.dataset.modal);
    });
  }

  //Open modal

  let openModalButtons = document.getElementsByClassName("open-modal");

  for (var i = 0; openModalButtons.length > i; i++) {
    openModalButtons[i].addEventListener("click", (e) => {
      modalUI.openModal(e.target);
    });
  }

  let photoToggle = document.getElementById("photo-display");

  if (photoToggle) {
    toggle();
    photoToggle.addEventListener("change", toggleHandle);
  }

  let basic = document.getElementById("basic-data-form");
  let residence = document.getElementById("residence-form");
  let contact = document.getElementById("contact-form");
  let language = document.getElementById("language-form");
  let skills = document.getElementById("skills-form");
  let saveCVButton = document.getElementById("save-cv-button");
  let cvId = localStorage.getItem("currentCvId");

  if (basic) {
    modalUI.autoExpandTextarea(document.getElementById("about-input"));
    modalUI.countCharacters(document.getElementById("about-input"));
    photoUpload();
    photoCRUD.readPhoto();
    basic.addEventListener("submit", (e) => {
      e.preventDefault();
      let newData = basicDataCRUD.basicData();
      let valid = validation.validateData(newData);
      if (valid) {
        basicDataCRUD.addBasicData(newData);
        if (cvId) {
          completeCvCRUD.saveCvHandle(cvId);
        }
      }
    });
  }
  if (residence) {
    residence.addEventListener("submit", (e) => {
      e.preventDefault();
      let newData = basicDataCRUD.residenceData();
      let valid = validation.validateData(newData);
      if (valid) {
        basicDataCRUD.addResidenceData(newData);
        if (cvId) {
          completeCvCRUD.saveCvHandle(cvId);
        }
      }
    });
  }
  if (contact) {
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      let newData = basicDataCRUD.contactData();
      let valid = validation.validateData(newData);
      if (valid) {
        basicDataCRUD.addContactData(newData);
        if (cvId) {
          completeCvCRUD.saveCvHandle(cvId);
        }
      }
    });
  }
  if (language) {
    language.addEventListener("submit", (e) => {
      e.preventDefault();
      let newData = langSkillCRUD.languageData();
      let valid = validation.validateData(newData);
      if (valid) {
        let contains = validation.checkForDuplicates(newData);
        if (contains) {
          validation.showAlert("language", "Language already on list");
        } else {
          langSkillCRUD.addLanguage(newData);
          if (cvId) {
            completeCvCRUD.saveCvHandle(cvId);
          }
        }
      }
    });
  }
  if (skills) {
    skills.addEventListener("submit", (e) => {
      e.preventDefault();
      let newData = langSkillCRUD.skillData();
      let valid = validation.validateData(newData);
      if (valid) {
        let contains = validation.checkForDuplicates(newData);
        if (contains) {
          validation.showAlert("skill", "Skill already on list!");
        } else {
          langSkillCRUD.addSkill(newData);
          document.getElementById("skill-input").value = "";
          if (cvId) {
            completeCvCRUD.saveCvHandle(cvId);
          }
        }
      }
    });
  }
  if (saveCVButton) {
    saveCVButton.addEventListener("click", () => {
      completeCvCRUD.saveCvHandle(cvId);
    });

    document
      .getElementById("download-button")
      .addEventListener("click", ExportPdf);

    kendo.pdf.defineFont({
      "DejaVu Sans":
        "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf",
      "DejaVu Sans|Bold":
        "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
      "DejaVu Sans|Bold|Italic":
        "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
      "DejaVu Sans|Italic":
        "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
      WebComponentsIcons:
        "https://kendo.cdn.telerik.com/2017.1.223/styles/fonts/glyphs/WebComponentsIcons.ttf",
    });

    function ExportPdf() {
      let name = document.querySelector(".about h1").innerText;
      kendo.drawing
        .drawDOM("#myCanvas", {
          forcePageBreak: ".page-break",
          paperSize: "A4",
          margin: { top: "0cm", bottom: "0cm" },
          scale: 0.9,
          height: 500,
          template: $("#page-template").html(),
          keepTogether: ".prevent-split",
        })
        .then(function (group) {
          kendo.drawing.pdf.saveAs(group, name + " CV.pdf");
        });
    }
  }
};

export { router, navigateTo, toggle };
