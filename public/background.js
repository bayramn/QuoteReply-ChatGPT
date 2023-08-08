/*global chrome*/
let completedTabs = {};
let lastChatId;

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    (tab.url && tab.url.includes("chat.openai.com")) ||
    tab.url.includes("https://chat.openai.com/?model=")
  ) {
    // console.log(
    //   "background script is running for 'chat.openai.com/c' page ..."
    // );
    const chatId = tab.url.split("c/")[1];

    if (
      changeInfo.status === "complete" &&
      tab.status === "complete" &&
      tab.url !== undefined
    ) {
      console.log("Page is fully loaded");
      console.log("NEW chatId is being sent from background.js: ", chatId);
      chrome.tabs.sendMessage(tabId, {
        url: tab.url,
        type: "NEW",
        chatId: chatId,
      });
    }
    lastChatId = chatId;
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "https://chat.openai.com" });
});
