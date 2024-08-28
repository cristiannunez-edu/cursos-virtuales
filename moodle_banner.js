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

  HTMLContent += `<style>${getCSS()}</style>`;

  HTMLContent += `<div style="width: 100%;">
          <div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Orientaciones Generales - INFOTEP" frameborder="0" width="1200" height="675" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genial.ly/637319db776f50001a1d1c82" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div>
        </div>`;

  divCourseContent.insertAdjacentHTML('afterbegin', HTMLContent);
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

function getCSS() {
  return `@supports (font-variation-settings:normal){.banner-container>*{font-family:InterVariable,sans-serif}}.hidden{display:none}.banner-{container-name:banner;container-type:inline-size}.banner-,.banner-container>*{margin:0;padding:0;box-sizing:border-box;user-select:none;font-family:Inter,sans-serif;font-feature-settings:'liga' 1,'calt' 1;-webkit-font-smoothing:antialiased}.banner-container{position:relative;height:18.75rem;border-radius:1.5rem;overflow:hidden;margin-bottom:1rem}.banner-image-background{position:absolute;z-index:0;width:100%;height:100%;background-position:center;background-repeat:no-repeat;background-size:cover}.banner-glass-effect{position:absolute;z-index:0;width:100%;height:100%;background:rgba(0,0,0,.3);backdrop-filter:blur(6rem)}.banner-wrapper{position:absolute;z-index:3;width:100%;height:100%;padding:2rem;display:grid;grid-gap:2rem;grid-auto-flow:column dense;justify-content:space-between;color:#fff}.banner-wrapper:has(.banner-image.hidden){grid-gap:0;justify-content:center;}.banner-container:has(.banner-image.hidden){background:#0f47ad}.banner-container:has(.banner-image.hidden) .banner-glass-effect{backdrop-filter:none}.banner-wrapper:has(.banner-image.hidden) .banner-content{justify-items:center;text-align:center}.banner-wrapper:has(.banner-image.hidden) .banner-top{text-align:center}.banner-wrapper:has(.banner-image.hidden) .banner-image-container{display:none}.banner-content{display:grid}.banner-top{display:flex;align-items:center;align-self:flex-start}.infotep_logo{width:3rem;height:3rem;border-radius:50%;display:flex;justify-content:center;align-items:center;padding:.5rem;margin-right:.75rem;background:#fff url("https://raw.githubusercontent.com/cristiannunez-edu/cursos-virtuales/main/images/_infotep-virtual.png") no-repeat center;background-size:70%}.banner-welcome{opacity:90%}.banner-course-name{font-weight:700;font-size:1.75rem;margin-bottom:.5rem}.banner-course-shortname{font-size:1rem;opacity:70%}.banner-image-container{overflow:hidden}.banner-image{border-radius:.75rem;height:100%;width:100%;min-width:20rem;object-fit:cover;object-position:center}.banner-course-dates{text-align:center}@container banner (max-width:1024px){.banner-container{grid-template-rows:1fr}.banner-wrapper:not(:has(.banner-image.hidden)){grid-template-columns:1fr}.banner-wrapper:not(:has(.banner-image.hidden)) .banner-content{justify-items:center;text-align:center}.banner-wrapper:not(:has(.banner-image.hidden)) .banner-image-container{display:none}}@container banner (min-width:1440px){.banner-wrapper{justify-content:center}}#section-0 .section_action_menu,#section-0 a[href*=editsection]{display:none!important}`;
}

})();