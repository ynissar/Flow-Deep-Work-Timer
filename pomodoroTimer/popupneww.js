let curTime = new Date();
let alarmTime = new Date();
console.log(curTime);

let curDate = curTime.getDate();
let curHours = curTime.getHours();
let curMinutes = curTime.getMinutes();
let curSeconds = curTime.getSeconds();
let alarmLengthInMin = 75;
let alarmLengthInSec = alarmLengthInMin * 60;

calculateAlarmTime(
  curDate,
  curHours,
  curMinutes,
  curSeconds,
  alarmLengthInSec,
  alarmTime
);

console.log(alarmTime);

let difference = Math.abs(alarmTime - curTime);
console.log(difference); // difference in milliseconds

function continueTimer() {}

function startTimer() {}

function pauseTimer() {}

function restartTimer() {}

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
