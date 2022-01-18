chrome.alarms.onAlarm.addListener(function () {
  chrome.browserAction.setBadgeText({ text: "" });
  chrome.storage.sync.get(["minutes"], function (item) {
    if (item.minutes === 25) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "breaktime.png",
        title: "Break Time!",
        message:
          "It is time to take a break! You have 5 minutes to do whatever you want!",
        priority: 0,
      });
    } else if (item.minutes === 5) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "Timesup.png",
        title: "Times Up!",
        message:
          "It's time to get back to work! You have 25 minutes until your next break!",
        priority: 0,
      });
    }
  });
});

//Tracks whether 25 minutes have passed
chrome.notifications.onClosed.addListener(function () {
  chrome.storage.sync.get(["minutes"], function (item) {
    chrome.browserAction.setBadgeText({ text: "ON" });
    if (item.minutes === 5) {
      chrome.storage.sync.set({ minutes: 25 });
      chrome.alarms.clearAll();
      chrome.alarms.create({ delayInMinutes: item.minutes });
    } else if (item.minutes === 25) {
      chrome.storage.sync.set({ minutes: 5 });
      chrome.alarms.clearAll();
      chrome.alarms.create({ delayInMinutes: item.minutes });
    }
  });
});
