function setAlarm(event) {
  let minutes = parseFloat(event.target.value);
  chrome.browserAction.setBadgeText({ text: "ON" });
  chrome.alarms.create({ delayInMinutes: minutes });
  chrome.storage.sync.set({ minutes: minutes });
  window.close();
}

function clearAlarm() {
  chrome.browserAction.setBadgeText({ text: "" });
  chrome.alarms.clearAll();
  window.close();
}

document.getElementById("start").addEventListener("click", setAlarm);
document.getElementById("cancel").addEventListener("click", clearAlarm);
