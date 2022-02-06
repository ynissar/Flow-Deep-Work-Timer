let alarmTime = new Date();
let displayCountdown; // global variable for timed display of the count down

let { curTime, curDate, curHours, curMinutes, curSeconds } =
  getCurrentTimeData();
let alarmLengthInMin = 75;
let alarmLengthInSec = alarmLengthInMin * 60;

document.getElementById("start").addEventListener("click", () => {
  if (document.getElementById("start") != null) {
    startTimer();
  }
});

document.getElementById("reset").addEventListener("click", restartTimer);

displayTime(alarmLengthInSec);
function continueTimer() {}

function startTimer() {
  let timeData = getCurrentTimeData();
  let { curTime, curDate, curHours, curMinutes, curSeconds } = timeData;

  calculateAlarmTime(
    curDate,
    curHours,
    curMinutes,
    curSeconds,
    alarmLengthInSec,
    alarmTime
  );

  let difference = Math.abs(alarmTime - curTime);

  chrome.alarms.create("timer", { when: Date.now() + difference }); // alarm to track when the timer is finished

  chrome.storage.sync.set({ isTimerRunning: true });
  chrome.storage.sync.set({ alarmEnd: Date.now() + difference });

  displayCountdown = setInterval(() => {
    displayTime(difference / 1000); // divide by 1000 to make it into seconds
    if (difference == 0) {
      clearInterval(countDown);
    }
    difference = difference - 1000;
    chrome.storage.sync.set({ alarmTimeElapsed: difference });
    console.log(difference);
  }, 1000);

  //   document.getElementById("start").innerHTML = "pause"; // changed the button to say pause
  //   document.getElementById("start").id = "pause"; // changes the id of the button to pause

  let startButton = document.getElementById("start");
  startButton.remove();

  let pauseButton = document.createElement("button");
  pauseButton.innerHTML = "pause";
  pauseButton.id = "pause";

  let btnGroup = document.getElementById("btn-group");
  btnGroup.insertBefore(pauseButton, btnGroup.childNodes[0]);

  // creates an event listener for pause
  document.getElementById("pause").addEventListener("click", () => {
    if (document.getElementById("pause") != null) {
      pauseTimer();
    }
  });
}

function pauseTimer() {
  clearInterval(displayCountdown);

  chrome.storage.sync.set({ isTimerRunning: false });

  chrome.alarms.clear("timer");

  //   chrome.alarms.get("timer", (alarm) => {
  //     console.log(alarm);
  //   });

  let pauseButton = document.getElementById("pause");
  pauseButton.remove();

  let unpauseButton = document.createElement("button");
  unpauseButton.innerHTML = "unpause";
  unpauseButton.id = "unpause";

  let btnGroup = document.getElementById("btn-group");
  btnGroup.insertBefore(unpauseButton, btnGroup.childNodes[0]);

  document.getElementById("unpause").addEventListener("click", () => {
    if (document.getElementById("unpause") != null) {
      unpauseTimer();
    }
  });
}

function unpauseTimer() {
  chrome.storage.sync.set({ isTimerRunning: true });

  chrome.storage.sync.get(["alarmTimeElapsed"], (result) => {
    difference = result.alarmTimeElapsed;

    chrome.alarms.create("timer", { when: Date.now() + difference }); // alarm to track when the timer is finished

    //console.log(`Difference at start of unpause: ${difference}`);
    displayCountdown = setInterval(() => {
      displayTime(difference / 1000); // divide by 1000 to make it into seconds
      if (difference == 0) {
        clearInterval(countDown);
      }
      difference = difference - 1000;
      chrome.storage.sync.set({ alarmTimeElapsed: difference });
      console.log(difference);
    }, 1000);
  });

  let unpauseButton = document.getElementById("unpause");
  unpauseButton.remove();

  let pauseButton = document.createElement("button");
  pauseButton.innerHTML = "pause";
  pauseButton.id = "pause";

  let btnGroup = document.getElementById("btn-group");
  btnGroup.insertBefore(pauseButton, btnGroup.childNodes[0]);

  document.getElementById("pause").addEventListener("click", () => {
    if (document.getElementById("pause") != null) {
      pauseTimer();
    }
  });
}

function restartTimer() {
  clearInterval(displayCountdown);

  chrome.alarms.clear("timer");

  displayTime(alarmLengthInSec);

  let button;

  if (document.getElementById("pause") != null) {
    button = document.getElementById("pause");
  } else {
    button = document.getElementById("unpause");
  }

  button.remove();

  let startButton = document.createElement("button");
  startButton.innerHTML = "start";
  startButton.id = "start";

  let btnGroup = document.getElementById("btn-group");
  btnGroup.insertBefore(startButton, btnGroup.childNodes[0]);

  document.getElementById("start").addEventListener("click", startTimer);
}

// Updates timer to reflect
function displayTime(alarmTimeLeftInSec) {
  let min = Math.floor(alarmTimeLeftInSec / 60);
  let sec = Math.floor(alarmTimeLeftInSec % 60);
  const timer = document.getElementById("timer");
  timer.innerHTML = `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Returns current time object with all important properties
function getCurrentTimeData() {
  let curTime = new Date();
  let curData = {
    curTime: curTime,
    curDate: curTime.getDate(),
    curHours: curTime.getHours(),
    curMinutes: curTime.getMinutes(),
    curSeconds: curTime.getSeconds(),
  };

  return curData;
}

// Updates the given date object (alarmTime) with the day, hour, minute and second when the alarm should trigger
function calculateAlarmTime(
  curDate,
  curHours,
  curMinutes,
  curSeconds,
  alarmLengthInSec,
  alarmTime
) {
  let newSeconds = curSeconds + alarmLengthInSec;
  let addedMinutes = 0; // Minutes added from seconds (>=60)
  let addedHours = 0; // Hours added from minutes (>=60)
  let addedDays = 0; // Day added from hours over (>=24)

  // If seconds after adding the alarmLength >=60, shift it over to minutes
  if (newSeconds >= 60) {
    addedMinutes = Math.floor(newSeconds / 60);
    newSeconds = newSeconds % 60;
  }
  alarmTime.setSeconds(newSeconds); // Updates seconds in alarmTime

  let newMinutes = curMinutes + addedMinutes;

  // If minutes after adding the minutes from seconds >= 60, shift it over to hours
  if (newMinutes >= 60) {
    addedHours = Math.floor(newMinutes / 60);
    newMinutes = newMinutes % 60;
  }
  alarmTime.setMinutes(newMinutes); // Updates minutes in alarmTime

  let newHours = curHours + addedHours;

  // If hours after adding the hours from minutes >= 60, shift it over to days
  if (newHours >= 24) {
    addedDays = Math.floor(newHours / 24);
    newHours = newHours % 24;
  }
  alarmTime.setHours(newHours); // Updates hours in alarmTime

  // Adds an extra day if days from hours >= 24
  newDate = curDate + addedDays;

  alarmTime.setDate(newDate); // Updates date in alarmTime
}

// chrome.storage.sync.get(["isTimerRunning"], (result) => {
//     console.log(result.isTimerRunning);
//   });
