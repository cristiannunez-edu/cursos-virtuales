window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    alert("Cargando datos :D")
  })

  $( document ).ready(function() {
    console.log( "ready!" );
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const courseID = urlParams.get('id');

const courseIMG = document.getElementById('courseIMG');
const courseTITLE = document.getElementById('courseTITLE');
const courseDATE = document.getElementById('courseDATE');


const GOOGLE_API_KEY = 'AIzaSyDaF0-aegTRahNHasCpxBfMJCoarnOJ0r8';
const SPREADSHEET_ID = '1ltHrfd-u2Ur35cxEHgfnVOsmel8z-6goofv2n9TW5WI';
const PROTOCOL = 'https://';
const URL_GOOGLEAPIS = PROTOCOL + 'sheets.googleapis.com/$discovery/rest?version=v4'
const SHEET_NAME = 'Listado';
const DATA_RANGE = 'A2:I6'

const start = () => {
    // Initialize the JavaScript client library
    gapi.client.init({
        'apiKey': GOOGLE_API_KEY,
        'discoveryDocs': [URL_GOOGLEAPIS],
    }).then(() => {
        return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!${DATA_RANGE}`
        })
    }).then((response) => {
        // Parse the response data
        const loadedData = response.result.values;

        for(let i = 1; i< loadedData.length; i++) {
            if( loadedData[i][0] == courseID) {
                courseTITLE.innerHTML = loadedData[i][1];
                courseIMG.src = loadedData[i][2];
                courseDATE.innerHTML = loadedData[i][3];
                
                break;
            }
        }

    
    }).catch((err) => {
        console.log("Ha ocurrido un error: " + err.error.message);
    });
    };

// Load the JavaScript client library
gapi.load('client', start);