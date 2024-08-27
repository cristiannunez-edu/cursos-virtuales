(() => {
const divCourseContent = document.querySelector('#region-main .course-content')
const courseID = getIDFromUrl();

displayBanner();

function getIDFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get('id');
}

function displayBanner() {
  if (divCourseContent && courseID) {

    const sessionData = getDataFromSessionStorage();

    if (sessionData) {
      loadHTMLContent(sessionData);
      return;
    }

    getDataFromGoogleSheets();
  }

}

function getDataFromGoogleSheets() {
  // Verify which tab to load, based on ID
  const tabID = (courseID > 11440) ? '1731321410' : '0'

  let query = encodeURI(`SELECT+A,B,C,D,E,F,G+WHERE+A+=+${courseID}`);

  let queryURL = `https://docs.google.com/spreadsheets/d/1ltHrfd-u2Ur35cxEHgfnVOsmel8z-6goofv2n9TW5WI/gviz/tq?gid=${tabID}&tqx=out:json&tq=${query}`;

  // Load data
  loadData(queryURL);
}

function loadHTMLContent(courseInfo) {
  const [moodleID, name, category, image, startDate, shortName, endDate] = courseInfo;
  

  if (!(name && startDate)) {
    console.log('No data name and startdate present')
    return;
  }

  let HTMLContent = `
  <link href="https://cdn.jsdelivr.net/gh/cristiannunez-edu/cursos-virtuales@main/moodle_banner.min.css" rel="stylesheet" type="text/css" />
  <link rel="preconnect" href="https://rsms.me/">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
  <div class="banner-">
  <div class="banner-container">
    <div class="banner-image-background" style="background-image: url('${image}')"></div>
    <div class="banner-glass-effect"></div>
    <div class="banner-wrapper">
        <div class="banner-content">
          <div class="banner-top">
            <div class="infotep_logo"></div>
            <div class="banner-welcome">Te damos la bienvenida al curso</div>
          </div>
          <div class="banner-center">
            <div class="banner-course-name">
              ${name}
            </div>
            <div class="banner-course-shortname">
            ${shortName}
            </div>
          </div>
        </div>
        <div class="banner-image-container"><img class="banner-image" alt="" src="${image}" loading="lazy" crossorigin="anonymous" onerror="this.classList.add('hidden')"></div>
    </div>
  </div>`;

  if (startDate) {
    HTMLContent += `<p class="banner-course-dates">Desde el <b class="course-date-start">${startDate}</b> `;

    if (endDate) {
      HTMLContent += `hasta el <b class="course-date-end">${endDate}</b>`;
    }

    HTMLContent += `</p>`;
  }
  
  HTMLContent += `</div>`;

  HTMLContent += `<div style="width: 100%;">
          <div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Orientaciones Generales - INFOTEP" frameborder="0" width="1200" height="675" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genial.ly/637319db776f50001a1d1c82" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div>
        </div>`;

  divCourseContent.innerHTML = HTMLContent;
}

function loadData(googleSheetsQueryURL) {
  try {
    fetch(googleSheetsQueryURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok`);
        }
        return response.text();
      })
      .then(text => {
        if (text) {
          processResponse(text)
        }
      })

  } catch (e) {
    console.error(`An error occurred during course data fetching: ${e}`);
  }
}

function processResponse(text) {
  const data = convertGoogleResponseToJSON(text);

  const values = extractValuesFromData(data);

  if (values) {
    loadHTMLContent(values)
    saveDataOnSessionStorage(values);
  }

}

function convertGoogleResponseToJSON(text) {
  text = text.replaceAll(
    "/*O_o*/\ngoogle.visualization.Query.setResponse(",
    ""
  );
  return JSON.parse(text.substring(0, text.length - 2));
}

function extractValuesFromData(data) {
  // Process data
  if (data.status === 'ok' && data.table.rows.length > 0) {
    return data.table.rows[0]['c'].map(item => item ? item['f'] || item['v'] : "")
  }

  console.log('No data course found');
}

function saveDataOnSessionStorage(data) {
  sessionStorage.setItem(`ci${courseID}`, JSON.stringify(data));
}

function getDataFromSessionStorage() {
  const data = sessionStorage.getItem(`ci${courseID}`);

  if (data) {
    return JSON.parse(data)
  }
}

})();