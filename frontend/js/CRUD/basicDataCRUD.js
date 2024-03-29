class BasicData {
  constructor(name, surname, proffesion, about) {
    this.name = { data: name, isRequired: true };
    this.surname = { data: surname, isRequired: true };
    this.proffesion = { data: proffesion, isRequired: false };
    this.about = { data: about, isRequired: true };
  }
}

class Residence {
  constructor(country, city) {
    this.country = { data: country, isRequired: true };
    this.city = { data: city, isRequired: true };
  }
}

class Contact {
  constructor(phone, email, linkedin, github) {
    this.phone = { data: phone, isRequired: true };
    this.email = { data: email, isRequired: true };
    this.linkedin = { data: linkedin, isRequired: false };
    this.github = { data: github, isRequired: false };
  }
}

class basicDataUpdate {
  static basicData() {
    let name = document.getElementById("name-input").value;
    let surname = document.getElementById("surname-input").value;
    let proffesion = document.getElementById("proffesion-input").value;
    let about = document.getElementById("about-input").value;

    let basicData = new BasicData(name, surname, proffesion, about);

    return basicData;
  }

  static residenceData() {
    let country = document.getElementById("country-input").value;
    let city = document.getElementById("city-input").value;

    let residenceData = new Residence(country, city);

    return residenceData;
  }

  static contactData() {
    let phone = document.getElementById("phone-input").value;
    let email = document.getElementById("email-input").value;
    let linkedin = document.getElementById("linkedin-input").value;
    let github = document.getElementById("github-input").value;

    if (linkedin) {
      switch (linkedin.slice(0, 4)) {
        case "http":
          break;
        case "www.":
          linkedin =
            "https://" + document.getElementById("linkedin-input").value;
          break;
        default:
          linkedin =
            "https://www." + document.getElementById("linkedin-input").value;
      }
    }

    if (github) {
      switch (github.slice(0, 4)) {
        case "http":
          switch (github.slice(0, 9)) {
            case "https://w":
              break;
            default:
              github = "https://www." + github.slice(8, github.length);
          }
          break;
        case "www.":
          github = "https://" + document.getElementById("github-input").value;
          break;
        default:
          github =
            "https://www." + document.getElementById("github-input").value;
      }
    }

    let contactData = new Contact(phone, email, linkedin, github);

    return contactData;
  }

  static readBasicData() {
    let basicData = JSON.parse(localStorage.getItem("basicData"));
    let currentPage = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

    if (basicData && currentPage === "basic") {
      document.getElementById("name-input").value = basicData.name.data;
      document.getElementById("surname-input").value = basicData.surname.data;
      document.getElementById("proffesion-input").value =
        basicData.proffesion.data;
      document.getElementById("about-input").value = basicData.about.data;
    }
    if (basicData) {
      document.getElementById("about").innerText = basicData.about.data;
      document.querySelector(".about h1").innerText =
        basicData.name.data + " " + basicData.surname.data;
      document.getElementById("proffesion").innerText =
        basicData.proffesion.data;
    }
  }

  static readResidenceData() {
    let residenceData = JSON.parse(localStorage.getItem("residenceData"));
    let currentPage = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

    if (residenceData && currentPage === "basic") {
      document.getElementById("country-input").value =
        residenceData.country.data;
      document.getElementById("city-input").value = residenceData.city.data;
    }
    if (residenceData) {
      document.getElementById("residence").innerText =
        residenceData.city.data + ", " + residenceData.country.data;
    }
  }

  static readContactData() {
    let contactData = JSON.parse(localStorage.getItem("contactData"));
    let currentPage = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    if (contactData) {
      let displayLinkedinLink = contactData.linkedin.data.slice(
        12,
        contactData.linkedin.data.length
      );
      let displayGithubLink = contactData.github.data.slice(
        12,
        contactData.github.data.length
      );

      if (currentPage === "basic") {
        document.getElementById("phone-input").value = contactData.phone.data;
        document.getElementById("email-input").value = contactData.email.data;
        document.getElementById("linkedin-input").value =
          contactData.linkedin.data;
        document.getElementById("github-input").value = contactData.github.data;
      }

      document.getElementById("phone").innerText = contactData.phone.data;
      document.getElementById("email").innerText = contactData.email.data;
      if (contactData.linkedin.data !== "") {
        document.getElementById("linkedin").parentNode.style.display =
          "list-item";
        document.getElementById("linkedin").innerText = displayLinkedinLink;
        document.getElementById("linkedin").parentNode.parentNode.href =
          contactData.linkedin.data;
      } else {
        document.getElementById("linkedin").parentNode.style.display = "none";
      }
      if (contactData.github.data !== "") {
        document.getElementById("github").parentNode.style.display =
          "list-item";
        document.getElementById("github").innerText = displayGithubLink;
        document.getElementById("github").parentNode.parentNode.href =
          contactData.github.data;
      } else {
        document.getElementById("github").parentNode.style.display = "none";
      }
    }
  }

  static addBasicData(data) {
    localStorage.setItem("basicData", JSON.stringify(data));

    this.readBasicData();
  }

  static addResidenceData(data) {
    localStorage.setItem("residenceData", JSON.stringify(data));

    this.readResidenceData();
  }

  static addContactData(data) {
    localStorage.setItem("contactData", JSON.stringify(data));

    this.readContactData();
  }
}

export default basicDataUpdate;
