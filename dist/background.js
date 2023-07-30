/*global chrome*/
let baseUrl = "https://www.lanterapp.com";
//console.log("chrome.runtime.id: ", chrome.runtime.id);
if (chrome.runtime.id === "dddkbkfbiikdebcdafdnjcimkooehmfb") {
  baseUrl = "https://www.lanterapp.com";
} else {
  baseUrl = "http://localhost:5000";
}
//console.log("baseUrl: ", baseUrl);
let userData = {
  token: undefined,
  user: undefined,
  loading: false,
};
let userBookmarks = [];
let userNotes = [];
let completedTabs = {};
let lastVideoId;
console.log("background script...", new Date());

// chrome.tabs.query({ url: "*://chat.openai.com/*" }, function (tabs) {
//   if (tabs.length) {
//     console.log("Tabs: ", tabs);
//     //chrome.tabs.executeScript(tabs[tabs.length - 1].windowId, {
//     chrome.scripting.executeScript({
//       target: { tabId: tabs[tabs.length - 1].id },
//       function: simulateTyping,
//       args: ["Hey what's up?"],
//     });
//   }
// });

function simulateTyping() {
  const message = arguments[0];
  const textarea = document.querySelector("#prompt-textarea");
  textarea.focus();
  textarea.select();
  document.execCommand("insertText", false, message);
  document.querySelector("#prompt-textarea").nextElementSibling.click();
}

chrome.tabs.onCreated.addListener((tab) => {
  // Your code here, which will run when a new tab is opened
  chrome.action.setBadgeText({ text: "" });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //console.log("tabId: ", tabId);
  //console.log("tab: ", tab);
  // Send new video to content script when youtube.com/watch page is loaded
  if (tab.url && tab.url.includes("chat.openai.com/c")) {
    console.log(
      "background script is running for 'chat.openai.com/c' page ..."
    );
    const chatId = tab.url.split("c/")[1];
    //console.log(chatId);
    // if (
    //   changeInfo.status === "complete" &&
    //   tab.status === "complete" &&
    //   tab.url !== undefined
    // ) {
    //   console.log("Page is fully loaded");
    console.log("NEW chatId is being send from background.js");
    chrome.tabs.sendMessage(tabId, {
      url: tab.url,
      type: "NEW",
      chatId: chatId,
    });
    //}
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openTab") {
    chrome.tabs.create({ url: request.url });
  }
});

chrome.action.onClicked.addListener((tab) => {
  console.log("Extension is clicked...");
  chrome.tabs.create({ url: "https://chat.openai.com" }); // replace with your chat URL
});
