(() => {
  const parentElement = "#region-main .course-content";
  const regionMain = document.querySelector(parentElement);

  if (parentElement) {
    regionMain.insertAdjacentHTML("afterbegin", `
        <div class="banner-container">
          <div class="banner-images">
            <img class="course-image" src="" alt=" ">
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
          <p>El curso inicia el <b class="course-date"></b></p>
        </div>
        <div style="width: 100%;">
          <div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Orientaciones Generales - INFOTEP" frameborder="0" width="1200" height="675" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genial.ly/637319db776f50001a1d1c82" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div>
        </div>
        `
      +
      `
        <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        
        #app-container > * {
          font-family: "Inter", sans-serif !important;
        }
    
        :root {
            --main-bg-color: #043474;
        }
        
        .banner-container {
          display: grid;
          grid-template-columns: 0.6fr 1fr;
          height: 300px;
          background: #043474;
          overflow: hidden;
          user-select: none;
        }
        
        .banner-images {
          position: relative;
          height: 100%;
        }
        
        .banner-images img {
          width: 100%;
          object-fit: cover;
        }
        
        .banner-images .course-image {
          height: 300px;
        }
    
        .banner-images img {
            position: relative;
        }
          
        /* style this to fit your needs */
        /* and remove [alt] to apply to all images*/
        .banner-images img[alt]:after {  
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--main-bg-color);
            font-family: 'Helvetica';
            font-weight: 300;
            line-height: 2;  
            text-align: center;
            content: attr(alt);
        }
        
        .banner-images .logo-infotep-virtual {
          position: absolute;
          z-indez: 999999;
          width: 80px;
          background: white;
          padding: 0.5rem;
          border-radius: 5px;
          bottom: 1rem;
          left: 0.75rem;
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
          font-size: clamp(0.5rem, 1vw + 1rem, 1rem);
        }
        
        .course-name {
          font-weight: bold;
          color: white;
          text-transform: uppercase;
          font-size: clamp(1.375rem, 2vw + 1rem, 2.25rem);
          flex-grow: 2;
          display: flex;
          align-items: center;
        }
        
        .course-welcome {
          text-align: center;
          padding: 1rem;
        }
        
        .course-welcome p {
          margin-top: 0.5rem;
          font-size: 1.2rem;
        }
        
        @media (max-width: 1024px) {
          .banner-container {
            grid-template-columns: 1fr;
          }
        
          .banner-images {
            display: none;
          }
        }
        </style>
        `);
  }

  window.addEventListener("DOMContentLoaded", (e) => {
    if (parentElement) {
      loadData();
    }
  });

  const getCourseIdFromUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get("id") || 0;
  };

  const courseID = getCourseIdFromUrl();

  const loadData = () => {
    const storedData = sessionStorage.getItem("c" + courseID);

    if (storedData) {
      parseData(JSON.parse(storedData));
      console.log("from storage");
    } else {
      // Fetch data from API
      gapi.load("client", start);
    }
  };

  const parseData = (data) => {
    const courseIMG = document.querySelector(`${parentElement} .course-image`);
    const courseTITLE = document.querySelector(`${parentElement} .course-name`);
    const courseCATEGORY = document.querySelector(`${parentElement} .course-category`);
    const courseDATE = document.querySelector(`${parentElement} .course-date`);

    courseTITLE.innerHTML = data[1];
    courseCATEGORY.innerHTML = data[5]; // Shortname
    courseIMG.src = data[3];
    courseDATE.innerHTML = data[4];
  };

  const start = () => {
    const fragment1 = "AIzaSyDaF0";
    const fragment2 = "aegTRahNHasCpxBfMJCoarnOJ0r8";
    const SPREADSHEET_ID = "1ltHrfd-u2Ur35cxEHgfnVOsmel8z-6goofv2n9TW5WI";
    const PROTOCOL = "https://";
    const URL_GOOGLEAPIS =
      PROTOCOL + "sheets.googleapis.com/$discovery/rest?version=v4";
    const SHEET_NAME = (courseID > "11500") ? "2024" : "Listado"; // Last moodle id from 2023
    const DATA_RANGE = "A2:I1000";

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
            parseData(loadedData[i]);
            // Save founded data on session storage
            sessionStorage.setItem("c" + courseID, JSON.stringify(loadedData[i]));
            break;
          }
        }
      })
      .catch((err) => {
        console.info("Ha ocurrido un error: " + err.message);
      });
  };

})();