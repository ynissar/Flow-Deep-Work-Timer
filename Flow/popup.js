let alarmTime = new Date(); // global alarm variable --> time when alarm ends
let displayCountdown; // global variable for timed display of the count down
let displayedTime = false; // Whether time has been displayed already

let alarmLengthInMin = 25; // Length of alarm
let alarmLengthInSec = alarmLengthInMin * 60; // length of alarm in minutes

chrome.storage.sync.set({ alarmLengthInMin: alarmLengthInMin });

// Creates an event listener for the start button
document.getElementById("start").addEventListener("click", () => {
  if (document.getElementById("start") != null) {
    startTimer();
  }
});

// Creates an event listener for the reset button
document.getElementById("reset").addEventListener("click", restartTimer);

// Displays time from alarmTimeElapsed if it exists in storage
chrome.storage.sync.get(["alarmTimeElapsed"], (result) => {
  let alarmTimeElapsed = result.alarmTimeElapsed;
  displayTime(Math.floor(alarmTimeElapsed / 1000));
  displayedTime = true;
});

if (displayedTime == false) {
  displayTime(alarmLengthInMin);
}

continueTimer();

// function continues timer if it is currently running
function continueTimer() {
  // Checks storage for isTimerRunning variable
  chrome.storage.sync.get(["isTimerRunning"], (running) => {
    let isTimerRunning = running.isTimerRunning;
    if (isTimerRunning) {
      // gets when the alarm is going to end and uses it to display the current time left until the alarm rings
      chrome.storage.sync.get(["alarmEnd"], (alarm) => {
        let alarmTime = alarm.alarmEnd;
        let timeData = getCurrentTimeData();
        let { curTime } = timeData;

        let difference = Math.abs(alarmTime - curTime);

        // set Interval updates countdown until alarm ends
        displayCountdown = setInterval(() => {
          displayTime(difference / 1000); // divide by 1000 to make it into seconds from milliseconds
          if (difference <= 1000) {
            // if the timer is finished, updates isTimerRunning and sets alarmTimeElapsed to the alarm's length
            clearInterval(displayCountdown);
            chrome.storage.sync.set({ isTimerRunning: false });
            chrome.storage.sync.set({
              alarmTimeElapsed: alarmLengthInSec * 1000,
            });
          }
          difference = difference - 1000;
          chrome.storage.sync.set({ alarmTimeElapsed: difference }); // updates alarmTimeElapsed every second
          console.log(difference);
        }, 1000);

        // removes start button
        let startButton = document.getElementById("start");
        startButton.remove();

        // creates pause button
        let pauseButton = document.createElement("button");
        pauseButton.innerHTML = "Pause";
        pauseButton.id = "pause";
        pauseButton.classList.add("button");

        // inserts pause button into DOM
        let btnGroup = document.getElementById("btn-group");
        btnGroup.insertBefore(pauseButton, btnGroup.childNodes[0]);

        // creates an event listener for pause
        document.getElementById("pause").addEventListener("click", () => {
          if (document.getElementById("pause") != null) {
            pauseTimer();
          }
        });
      });
      // if isTimerRunning is false
    } else {
      // removes start button
      let startButton = document.getElementById("start");
      startButton.remove();

      // replaces it with unpause button
      let unpauseButton = document.createElement("button");
      unpauseButton.innerHTML = "Start";
      unpauseButton.id = "unpause";
      unpauseButton.classList.add("button");

      // inserts unpause into DOM
      let btnGroup = document.getElementById("btn-group");
      btnGroup.insertBefore(unpauseButton, btnGroup.childNodes[0]);

      // creates an event listener for unpause
      document.getElementById("unpause").addEventListener("click", () => {
        if (document.getElementById("unpause") != null) {
          unpauseTimer();
        }
      });
    }
  });
}

// triggered when start button is pressed
// creates alarm and begins countdown until alarm ends
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

  let difference = Math.abs(alarmTime - curTime); // difference between the alarm end time and the current time

  chrome.alarms.create("timer", { when: Date.now() + difference }); // alarm to track when the timer is finished

  chrome.storage.sync.set({ isTimerRunning: true });
  chrome.storage.sync.set({ alarmEnd: Date.now() + difference });

  // set Interval updates countdown until alarm ends
  displayCountdown = setInterval(() => {
    displayTime(difference / 1000); // divide by 1000 to make it into seconds
    if (difference <= 1000) {
      clearInterval(displayCountdown);
      chrome.storage.sync.set({ isTimerRunning: false });
      chrome.storage.sync.set({ alarmTimeElapsed: alarmLengthInSec * 1000 });
    }
    difference = difference - 1000;
    chrome.storage.sync.set({ alarmTimeElapsed: difference });
    console.log(difference);
  }, 1000);

  // removes start button
  let startButton = document.getElementById("start");
  startButton.remove();

  // creates pause button
  let pauseButton = document.createElement("button");
  pauseButton.innerHTML = "Pause";
  pauseButton.id = "pause";
  pauseButton.classList.add("button");

  // inserts pause button into DOM
  let btnGroup = document.getElementById("btn-group");
  btnGroup.insertBefore(pauseButton, btnGroup.childNodes[0]);

  // creates an event listener for pause
  document.getElementById("pause").addEventListener("click", () => {
    if (document.getElementById("pause") != null) {
      pauseTimer();
    }
  });
}

// deletes alarm previously set
// pauses countdown until alarm end
function pauseTimer() {
  clearInterval(displayCountdown);

  chrome.storage.sync.set({ isTimerRunning: false });

  chrome.alarms.clear("timer");

  // removes pause button
  let pauseButton = document.getElementById("pause");
  pauseButton.remove();

  // replaces pause button with unpause button
  let unpauseButton = document.createElement("button");
  unpauseButton.innerHTML = "Unpause";
  unpauseButton.id = "unpause";
  unpauseButton.classList.add("button");

  // places unpause button into DOM
  let btnGroup = document.getElementById("btn-group");
  btnGroup.insertBefore(unpauseButton, btnGroup.childNodes[0]);

  // Creates an event listener for unpause button
  document.getElementById("unpause").addEventListener("click", () => {
    if (document.getElementById("unpause") != null) {
      unpauseTimer();
    }
  });
}

// unpause button
// creates alarm beginning from where the previous left off
function unpauseTimer() {
  chrome.storage.sync.set({ isTimerRunning: true });

  chrome.storage.sync.get(["alarmTimeElapsed"], (result) => {
    difference = result.alarmTimeElapsed;

    chrome.alarms.create("timer", { when: Date.now() + difference }); // creates alarm from now + the alarm time left

    // set Interval updates countdown until alarm ends
    displayCountdown = setInterval(() => {
      displayTime(difference / 1000); // divide by 1000 to make it into seconds
      if (difference <= 1000) {
        clearInterval(displayCountdown);
        chrome.storage.sync.set({ isTimerRunning: false });
        chrome.storage.sync.set({ alarmTimeElapsed: alarmLengthInSec * 1000 });
      }
      difference = difference - 1000;
      chrome.storage.sync.set({ alarmTimeElapsed: difference });
      console.log(difference);
    }, 1000);
  });

  // removes unpause button
  let unpauseButton = document.getElementById("unpause");
  unpauseButton.remove();

  // creates pause button
  let pauseButton = document.createElement("button");
  pauseButton.innerHTML = "Pause";
  pauseButton.id = "pause";
  pauseButton.classList.add("button");

  // places pause button into DOM
  let btnGroup = document.getElementById("btn-group");
  btnGroup.insertBefore(pauseButton, btnGroup.childNodes[0]);

  // creates event listener for pause button
  document.getElementById("pause").addEventListener("click", () => {
    if (document.getElementById("pause") != null) {
      pauseTimer();
    }
  });
}

// function restarts the timer and clears previous alarms
function restartTimer() {
  clearInterval(displayCountdown);

  chrome.alarms.clear("timer");
  chrome.storage.sync.set({ isTimerRunning: false });
  chrome.storage.sync.set({ alarmTimeElapsed: alarmLengthInSec * 1000 }); // Sets alarmTimeElapsed to the length of a focus session

  displayTime(alarmLengthInSec);

  let button;

  // removes the pause or unpause button depending on which is there
  if (document.getElementById("pause") != null) {
    button = document.getElementById("pause");
  } else {
    button = document.getElementById("unpause");
  }

  button.remove();

  // Creates the start button
  let startButton = document.createElement("button");
  startButton.innerHTML = "Start";
  startButton.id = "start";
  startButton.classList.add("button");

  // Inserts start button into DOM
  let btnGroup = document.getElementById("btn-group");
  btnGroup.insertBefore(startButton, btnGroup.childNodes[0]);

  document.getElementById("start").addEventListener("click", startTimer);
}

// Updates timer to reflect
function displayTime(alarmTimeLeftInSec) {
  let min = Math.floor(alarmTimeLeftInSec / 60);
  let sec = Math.floor(alarmTimeLeftInSec % 60);
  const timer = document.getElementById("timer"); // Gets timer element
  timer.innerHTML = `${min}:${sec < 10 ? "0" : ""}${sec}`; // Updates timer element to display minutes and seconds left
  const progressCircle = document.getElementById("circle");
  // Updates progress circle to reflect time passed
  progressCircle.style.strokeDashoffset = Math.floor(
    627 * ((alarmLengthInSec - alarmTimeLeftInSec) / alarmLengthInSec)
  );
  console.log(progressCircle.style.strokeDashoffset);
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
