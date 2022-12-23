const HTMLcode = `<div id="app-container">
  <div class="banner-container">
    <div class="banner-images">
      <img class="course-image" src="" alt=".">
      <div class="logo-infotep-virtual">
        <img src="https://lh6.googleusercontent.com/EQTIUNdUixyIt7D8VffJ8UVt1iiuYgkLVobj390xmt89HoOSbwhMSfFVy0M9gHP__iA=w2400" alt="infotep virtual logo">
      </div>
    </div>
    <div class="banner-content">
      <p class="course-category"></p>
      <p class="course-name"></p>
    </div>
  </div>
  <div class="course-welcome">
    <h3>¡Sean bienvenidos/as!</h3>
    <p>El curso inicia el <span class="course-date">...</span></p>
  </div>
</div>`;

const CSScode = `
<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  font-family: "Inter", sans-serif;
}

.course-welcome {
  text-align: center;
  padding: 1rem;
}

.course-welcome p {
  margin-top: 0.5rem;
}

.banner-container {
  display: grid;
  grid-template-columns: 0.6fr 1fr;
  height: 300px;
  background: #043474;
}

.banner-images {
  position: relative;
  backgroun: white;
  height: 100%;
}

.banner-images img {
  width: 100%;
  object-fit: cover;
}

.banner-images .course-image {
  height: 300px;
}

.banner-images .logo-infotep-virtual {
  position: absolute;
  z-indez: 999999;
  width: 90px;
  background: white;
  padding: 1rem;
  border-radius: 5px;
  bottom: 0;
  margin: 1rem;
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.25));
}

.banner-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.course-category {
  text-align: right;
  color: #6e8eb4;
  font-weight: bold;
}

.course-name {
  font-weight: bold;
  color: white;
  font-size: 2.5rem;
  padding-right: 3rem;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
`;

document.write(HTMLcode);
document.write(CSScode);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const courseID = urlParams.get("id");

const courseIMG = document.querySelector("#app-container .course-image");
const courseTITLE = document.querySelector("#app-container .course-name");
const courseCATEGORY = document.querySelector(
  "#app-container .course-category"
);
const courseDATE = document.querySelector("#app-container .course-date");

const fragment1 = "AIzaSyDaF0";
const fragment2 = "aegTRahNHasCpxBfMJCoarnOJ0r8";
const SPREADSHEET_ID = "1ltHrfd-u2Ur35cxEHgfnVOsmel8z-6goofv2n9TW5WI";
const PROTOCOL = "https://";
const URL_GOOGLEAPIS =
  PROTOCOL + "sheets.googleapis.com/$discovery/rest?version=v4";
const SHEET_NAME = "Listado";
const DATA_RANGE = "A2:I6";

const start = () => {
  // Initialize the JavaScript client library
  gapi.client
    .init({
      apiKey: fragment1 + "-" + fragment2,
      discoveryDocs: [URL_GOOGLEAPIS]
    })
    .then(() => {
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!${DATA_RANGE}`
      });
    })
    .then((response) => {
      // Parse the response data
      const loadedData = response.result.values;

      for (let i = 1; i < loadedData.length; i++) {
        if (loadedData[i][0] == courseID) {
          console.dir(loadedData[i]);

          courseTITLE.innerHTML = loadedData[i][1];
          courseCATEGORY.innerHTML = loadedData[i][2];
          courseIMG.src = loadedData[i][3];
          courseDATE.innerHTML = loadedData[i][4];

          break;
        }
      }
    })
    .catch((err) => {
      console.log("Ha ocurrido un error: " + err.message);
    });
};

function loadScript(url, callback) {
  // Adding the script tag to the head as suggested before
  var head = document.head;
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;

  // Then bind the event to the callback function.
  // There are several events for cross browser compatibility.
  script.onreadystatechange = callback;
  script.onload = callback;

  // Fire the loading
  head.appendChild(script);
  
  document.write('<script src="https://apis.google.com/js/api.js"></script>')
}

var myPrettyCode = function () {
  // Load the JavaScript client library
  
};

window.addEventListener("load",(e=>{
    console.log("page is fully loaded");
    gapi.load("client", start);
}))

loadScript("https://apis.google.com/js/api.js", myPrettyCode);
