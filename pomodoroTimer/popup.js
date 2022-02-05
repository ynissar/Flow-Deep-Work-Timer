const timer = document.getElementById("timer");
let sec = null;

// Updates sec to synced stored time
// Must use chrome.storage.sync.get instead of getSeconds as it skips the code block if it doesn't work
chrome.storage.sync.get(["focusedMinutes"], (result) => {
  let { seconds } = result;
  sec = seconds; // CHANGE THIS VAL TO CHANGE TEH SECONDS STORED (BECAUSE WE HAVE A VAL STORED ON CHROME ALL TEH TIME)
  setSeconds(sec);
  timer.innerHTML = displayTime(sec);
});

// If there isn't a time in seconds stored
if (sec == null) {
  sec = 25 * 60;
  timer.innerHTML = displayTime(sec);
}

document.getElementById("start").addEventListener("click", () => {
  startTimer(1);
});

// Displays the time in minutes and seconds
function displayTime(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;

  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// starts the timer
function startTimer(minutes) {}

// resets the timer
function resetTimer() {
  chrome.alarms.clear({ name: "focusTimer" }); // Clears the previous timer of the same name
}

// pauses the timer
function pauseTimer() {}

// function allows you to set the time you want to focus for
function changeTimerLength() {}

// plays a sound at the end of the timer
function playSound() {}

// opens a page, advises you to meditate for 5 minutes
function restTimer() {}

// Gets the seconds stored on the timer
function getSeconds() {
  let secondStored;
  chrome.storage.sync.get(["seconds"], (result) => {
    secondStored = result.seconds;
  });
  return secondStored;
}

function setSeconds(newSeconds) {
  chrome.storage.sync.set({ seconds: newSeconds });
}

// function setAlarm(event) {
//   let minutes = parseFloat(event.target.value);
//   chrome.browserAction.setBadgeText({ text: "ON" });
//   chrome.alarms.create({ delayInMinutes: minutes });
//   chrome.storage.sync.set({ minutes: minutes });
//   window.close();
// }

// function clearAlarm() {
//   chrome.browserAction.setBadgeText({ text: "" });
//   chrome.alarms.clearAll();
//   window.close();
// }

// const timer = document.getElementById("timer");
// let seconds = null;

// chrome.storage.sync.get(["sec"], (result) => {
//   let { sec } = result;
//   seconds = sec - 1;
//   chrome.storage.sync.set({ sec: seconds });
//   timer.innerHTML = `${seconds}`;
// });

// if (seconds == null) {
//   chrome.storage.sync.set({ sec: 75 });
//   timer.innerHTML = `${seconds}`;
// }

// function thingy() {
//   chrome.storage.sync.get(["sec"], (result) => {
//     let { sec } = result;
//     seconds = sec - 1;
//     chrome.storage.sync.set({ sec: seconds });
//   });
// }

// function setAlarm() {
//   chrome.storage.sync.get(["sec"], (result) => {
//     let { sec } = result;
//     seconds = sec - 1;
//     chrome.storage.sync.set({ sec: seconds });
//   });

//   timer.innerHTML = `${seconds}`;
// }

// document.getElementById("start").addEventListener("click", setAlarm);
// document.getElementById("cancel").addEventListener("click", clearAlarm);

// const timer = document.getElementById("timer");
// let timeSec = 75;

// displayTime(timeSec);

// const countDown = setInterval(() => {
//   timeSec--;
//   displayTime(timeSec);
//   if (timeSec <= 0) {
//     clearInterval(countDown);
//   }
// }, 1000);

// function displayTime(seconds) {
//   let min = Math.floor(seconds / 60);
//   let sec = seconds % 60;

//   timer.innerHTML = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
// }

// const for getting the timer by id

// Code for first getting the amount in seconds (then if it fails), if statement to set seconds in sync

// alarm = chrome.alarms.get("focusedAlarm");
//   alarm.then((alarm) => {
//     if (alarm) {
//       console.log(alarm.name);
//     }
//   });
