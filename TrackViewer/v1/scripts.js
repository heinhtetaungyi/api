// Assign
let ITRACK = {
  endKey: "",
  endPoint: "https://api.github.com/repos/heinhtetaungyi/api/contents/TrackViewer/counts.json",
  endUser: "",
  char1: "Z2hwX2EzOFVu",
  char2: "TFhCSGFmNDRWaHoxZG9kYmZ6TD",
  char3: "JhZ05paDFPOG1mcQ=="
}
let ITRACK_IS_VIEWED = "itrack_isviewed";
let ITRACK_IS_SETUP_MODE = false;
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
  fetch(ITRACK.endPoint,
    {
      headers: {
        Authorization: `token ${iTrackAtoB(ITRACK.char1+ITRACK.char2+ITRACK.char3)}`
      }
    })
  .then(response => response.json())
  .then(data => {
    ITRACK.endKey = data.sha;
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

  let res = await fetch(ITRACK.endPoint,
    {
      headers: {
        Authorization: `token ${iTrackAtoB(ITRACK.char1+ITRACK.char2+ITRACK.char3)}`
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
  fetch(ITRACK.endPoint,
    {
      headers: {
        Authorization: `Bearer ${iTrackAtoB(ITRACK.char1+ITRACK.char2+ITRACK.char3)}`
      }
    })
  .then(response => response.json())
  .then(existingData => {
    ITRACK.endKey = existingData.sha;
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
  fetch(ITRACK.endPoint,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${iTrackAtoB(ITRACK.char1+ITRACK.char2+ITRACK.char3)}`,
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
        console.error(
          "Error Updating",
          response.status,
          response.statusText,
          errorData
        );

      });
    }
  })
  .catch(error => {
    alert("Error realtime fetching: " + error);
    console.error("realtime fetch error:", error);
  });
}
function getDeviceType () {
  let userAgent = navigator.userAgent;
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
function getLanguage() {
  let l = navigator.language;
  const languageNames = new Intl.DisplayNames("en", {
    type: "language"
  });
  return languageNames.of(l);
}
function getRegion() {
  let l = navigator.language;
  const locale = new Intl.Locale(l);
  return locale.region;
}
function getDate() {
  let date = new Date();
  return date.toString();
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

  let browserName = navigator.appName;
  let screenSize = window.screen.width + "x" + window.screen.height;
  let deviceType = getDeviceType();
  let device = navigator.userAgent;
  let platform = navigator.platform;
  let language = getLanguage();
  let region = getRegion();
  let onlineStatus = navigator.onLine;
  let date = getDate();
  let key = generateiTrackId();

  let viewer = {
    "key": key,
    "ipAddress": ipAddress,
    "browserName": browserName,
    "screenSize": screenSize,
    "deviceType": deviceType,
    "device": device,
    "platform": platform,
    "language": language,
    "region": region,
    "date": date
  };
  console.log(viewer);
  addToViewer(viewer);
  //setViewed();
}

function isViewed() {
  let viewed = localStorage.getItem(ITRACK_IS_VIEWED);
  if (viewed) {
    return true;
  }
  return false;
}
function setViewed() {
  localStorage.setItem(ITRACK_IS_VIEWED, true);
}
function setTrackMode(s) {
  let mode = s.toString().toLowerCase().trim();
  if (mode === "1" || mode === "one" || mode === "once") {
    // to do
  }
}
function setUpToken(s) {
  let char1 = s.substr(0, 10);
  let char2 = s.substr(10, 10);
  let char3 = s.substr(20, s.length);
  ITRACK.char1 = char1;
  ITRACK.char2 = char2;
  ITRACK.char3 = char3;
}
function setUpPath(s) {
  ITRACK.endPoint = s;
}
function setiTrack(s) {
  if (s === undefined) {
    console.log("auto");
    startTrack();
  } else {
    console.log("setup");
    ITRACK.endPoint = s;
    startTrack();
  }
}

async function testiTrack() {
  let v = await getViewers();
  console.log(v);
  console.log(v.length+ " Views");
}

setiTrack();
//setTrackMode(1);
testiTrack();

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
//var aDay = 24*60*60*1000;
//console.log(timeSince(new Date(Date.now()-aDay)));
