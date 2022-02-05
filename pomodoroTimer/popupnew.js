const timer = document.getElementById("timer");
let focusedMinutes = null;
let onAlarmTime = {
  hour: null,
  min: null,
  sec: null,
};

let alarmT;
let currT;

let currentTime = {
  hour: null,
  min: null,
  sec: null,
};

chrome.storage.sync.get(["focusedMinutes"], (result) => {
  focusedMinutes = result.focusedMinutes; // CHANGE THIS VAL TO CHANGE TEH SECONDS STORED (BECAUSE WE HAVE A VAL STORED ON CHROME ALL TEH TIME)
  timer.innerHTML = displayTime(focusedMinutes);
});

if (focusedMinutes == null) {
  focusedMinutes = 75;
  chrome.storage.sync.set({ focusedMinutes: focusedMinutes });
  timer.innerHTML = displayTime(focusedMinutes);
}

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("reset").addEventListener("click", updateAlarmTime);

const countDown = setInterval(() => {
  let totalSec = currentTime.hour - onAlarmTime.hour;
});

function displayTime(seconds) {
  let totalSec = seconds;
  let min = Math.floor(totalSec / 60);
  let sec = totalSec % 60;

  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function startTimer() {
  const focusedAlarm = chrome.alarms.create("focusedAlarm", {
    when: Date.now() + 1000 * 60 * focusedMinutes,
  });
  updateAlarmTime();
}

function resetTimer() {
  chrome.alarms.clear("focusedAlarm");
}

function updateAlarmTime() {
  chrome.alarms.get("focusedAlarm", (result) => {
    let alarmTime = new Date(result.scheduledTime);

    alarmT = new Date(result.scheduledTime);
    onAlarmTime.hour = alarmTime.getHours();
    onAlarmTime.min = alarmTime.getMinutes();
    onAlarmTime.sec = alarmTime.getSeconds();
    return true;
  });
}

function updateCurrentTime() {
  let currentDate = Date.now();
  let currT = Date.now();
  currentTime.hour = currentDate.getHours();
  currentTime.min = currentDate.getMinutes();
  currentTime.sec = currentDate.getSeconds();
  return true;
}
