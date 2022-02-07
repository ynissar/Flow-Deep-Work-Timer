// Triggers onAlarm (focus session finished)
chrome.alarms.onAlarm.addListener(() => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "/logos/breaktime.png",
    title: "Break Time!",
    message:
      "It is time to take a break! You have 5 minutes to relax and unwind.",
    priority: 0,
  });
});
