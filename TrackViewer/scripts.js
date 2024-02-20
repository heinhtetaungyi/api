// Assign
let itrack = {
  endKey: "",
  endPoint: "https://api.github.com/repos/heinhtetaungyi/api/contents/TrackViewer/counts.json",
  endUser: "Z2hwX3lOS3dBalhCVDA1QWdSZ0g3TTBiblhENXVCT0ZHdzRUd3hVcg=="
}
function generateiTrackId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2,
    5);
  return `${timestamp}-${randomPart}`;
}
function iTrackAtoB(str) {
  return decodeURIComponent(escape(atob(str)));
}
function iTrackBtoA(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
async function iTrackViewers() {
  fetch(itrack.endPoint,
    {
      headers: {
        Authorization: `token ${iTrackAtoB(itrack.endUser)}`
      }
    })
  .then(response => response.json())
  .then(data => {
    itrack.endKey = data.sha;
    let jsonData = [];
    try {
      jsonData = JSON.parse(iTrackAtoB(data.content));
    } catch (e) {
      jsonData = [];
    }
    for (let i of jsonData) {
      if (i) {
        console.log(i);
        // to do
      }
    }
    return jsonData;
  })
  .catch(error => {
    console.error("Error fetching JSON data:", error);
  });
  return [];
}
async function getViewers() {
  let res = await fetch(itrack.endPoint,
    {
      headers: {
        Authorization: `token ${iTrackAtoB(itrack.endUser)}`
      }
    });
  if (res.ok) {
    let data = await res.json();
    let list = await JSON.parse(iTrackAtoB(data.content));
    return list;
  } else {
    console.error("Error fetching getViewers:", error);
    return [];
  }
  return [];
}

function addToViewer(viewer) {
  fetch(itrack.endPoint,
    {
      headers: {
        Authorization: `Bearer ${iTrackAtoB(itrack.endUser)}`
      }
    })
  .then(response => response.json())
  .then(existingData => {
    itrack.endKey = existingData.sha;
    let jsonData = [];
    try {
      jsonData = JSON.parse(iTrackAtoB(existingData.content));
    } catch (e) {
      jsonData = [];
    }
    if (!Array.isArray(jsonData)) {
      jsonData = [];
    }
    jsonData.push(viewer);
    updateiTrackList(existingData.sha, jsonData);
  })
  .catch(error => {
    console.error("Error: addToViewer",
      error);
  });
}

function updateiTrackList(key, array) {
  let data = JSON.stringify(array,
    null,
    2);
  data = iTrackBtoA(data);
  fetch(itrack.endPoint,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${iTrackAtoB(itrack.endUser)}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update file.json",
        content: data,
        sha: key
      })
    })
  .then(response => {
    if (response.ok) {
      //console.log("addToViewer");
    } else {
      response.json().then(errorData => {
        // console.error(
        //   console.error(
        //     "Error Updating",
        //     response.status,
        //     response.statusText,
        //     errorData
        //   );
      });
    }
  })
  .catch(error => {
    alert("Error realtime fetching: " + error);
    console.error("realtime fetch error:", error);
  });
}
function getDeviceType (userAgent) {
  let deviceType;
  let tabletPattern = / (tablet|ipad|playbook|silk)| (android (?!.*mobi))/i;
  let mobilePattern = / (mobi|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds)/i;
  if (tabletPattern.test (userAgent)) {
    deviceType = "tablet";
  } else if (mobilePattern.test (userAgent)) {
    deviceType = "mobile";
  } else {
    deviceType = "desktop";
  }
  return deviceType;
}
function getLanguageName(code) {
  const languageNames = new Intl.DisplayNames("en", {
    type: "language"
  });
  return languageNames.of(code);
}
async function startTrack() {
  let ipList = await fetch("https://api.ipify.org?format=json");
  let ipAddress;
  if (ipList.ok) {
    let a = await ipList.json();
    ipAddress = a.ip;
  } else {
    throw new Error("Request failed: " + ipList.status);
  }

  let screenSize = window.screen.width + "x" + window.screen.height;
  let browserName = navigator.appName;
  let platform = navigator.platform;
  let language = navigator.language;
  language = getLanguageName(language);
  let onlineStatus = navigator.onLine;
  let device = navigator.userAgent;
  let deviceType = getDeviceType(device);
  let key = generateiTrackId();

  let viewer = {
    "key": key,
    "ipAddress": ipAddress,
    "browserName": browserName,
    "screenSize": screenSize,
    "deviceType": deviceType,
    "platform": platform,
    "language": language,
    "device": device
  };
  addToViewer(viewer);
}
async function testTrack() {
  let v = await getViewers();
  console.log(v);
  console.log(v.length+ " Views");
}
startTrack();