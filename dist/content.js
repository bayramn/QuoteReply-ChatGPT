/*global chrome*/

(async () => {
  console.log("Content script is running!");

  chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
    const { type, chatId } = obj;
    console.log("--------- chatId: ", chatId);
    if (type === "NEW") {
      // currentVideo = videoId;
      newChatLoaded(chatId);
    } else if (type === "PLAY") {
      // if (currentVideo !== videoId) {
      //   const videoUrl = `https://www.youtube.com/watch?v=${videoId}&t=${timestamp}s`;
      //   //chrome.tabs.create({ url: videoUrl });
      //   chrome.runtime.sendMessage({ action: "openTab", url: videoUrl });
      // } else {
      //   youtubePlayer.currentTime = timestamp;
      //   youtubePlayer.play();
      // }
    }
  });
  function startObserver(chatContainer) {
    // Set up the MutationObserver
    let observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        // Check if there are new nodes added
        if (mutation.addedNodes.length > 0) {
          // For each new node, check if it's a response
          // mutation.addedNodes.forEach((node) => {
          //   if (node.className.includes("response_class")) {
          //     // replace 'response_class' with actual response class
          //     // Add the reply button to the new response
          //     addReplyButton(node);
          //   }
          // });
          console.log("New response..");
        }
      }
    });
    observer.observe(chatContainer, { childList: true, subtree: true });
  }
  const newChatLoaded = () => {
    // Check if the chat container exists
    let chatContainer = document.querySelector(".markdown"); // replace '.markdown' with actual chat container selector
    if (chatContainer) {
      // If it exists, start the observer
      startObserver(chatContainer);
    } else {
      // If it doesn't exist, set up an interval to check until it does exist
      let checkExist = setInterval(function () {
        chatContainer = document.querySelector(".markdown");
        if (chatContainer) {
          console.log("Checking chatContainer...");
          // When it exists, start the observer and clear the interval
          addInitialReplyButtons();
          startObserver(chatContainer);
          clearInterval(checkExist);
        }
      }, 100); // Check every 100ms
    }
  };
  const addReplyButton = () => {
    // Select all elements with class "markdown"
    let markdownDivs = document.querySelectorAll(".markdown");

    // Loop through each "markdown" div
    markdownDivs.forEach((markdownDiv) => {
      // Select all direct child p and pre elements
      let childElements = markdownDiv.querySelectorAll(
        ":scope > p, :scope > pre"
      );

      // Loop through each child element and append a button
      childElements.forEach((childElement) => {
        // Create a new button
        let replyButton = document.createElement("div");
        const replyIcon = document.createElement("img");

        //btn.innerHTML = "Reply"; // Change this to whatever you want the button to say
        //replyButton.style.display = "inline-block";
        replyButton.style.padding = "0.25em";
        replyButton.style.borderRadius = "20px";
        replyButton.style.width = "25px";
        replyButton.style.height = "25px";
        replyButton.className = "reply-button"; // Add any classes you want for styling
        replyButton.title = "Reply Button";
        replyIcon.src = chrome.runtime.getURL(
          "assets/reply.svg"
          // isYoutubeThemeDark()
          //   ? "assets/reply.svg"
          //   : "assets/reply.svg"
        );
        replyIcon.as = "image";
        replyIcon.style.width = "20px";
        replyIcon.className = "reply-icon";
        replyIcon.style.cursor = "pointer";
        replyButton.append(replyIcon);
        // Append the button to the child element

        if (childElement.tagName === "PRE") {
          // let childDiv = childElement.querySelector("div");
          // if (childDiv) {
          //   // If there is a div inside the pre tag
          //   childDiv.appendChild(replyButton);
          // }
        } else {
          childElement.appendChild(replyButton);
        }
      });
    });
  };
  const addInitialReplyButtons = () => {
    setTimeout(() => {
      // Select all elements with class "markdown"
      let markdownDivs = document.querySelectorAll(".markdown");
      // Loop through each "markdown" div
      markdownDivs.forEach((markdownDiv) => {
        // Select all direct child p and pre elements
        let childElements = markdownDiv.querySelectorAll(
          ":scope > p, :scope > pre"
        );
        // Loop through each child element and append a button
        childElements.forEach((childElement) => {
          // Create a new button
          let replyButton = document.createElement("div");
          const replyIcon = document.createElement("img");
          //btn.innerHTML = "Reply"; // Change this to whatever you want the button to say
          //replyButton.style.display = "inline-block";
          replyButton.style.padding = "0.25em";
          replyButton.style.borderRadius = "20px";
          replyButton.style.width = "25px";
          replyButton.style.height = "25px";
          replyButton.className = "reply-button"; // Add any classes you want for styling
          replyButton.title = "Reply Button";
          replyIcon.src = chrome.runtime.getURL(
            "assets/reply.svg"
            // isYoutubeThemeDark()
            //   ? "assets/reply.svg"
            //   : "assets/reply.svg"
          );
          replyIcon.as = "image";
          replyIcon.style.width = "20px";
          replyIcon.className = "reply-icon";
          replyIcon.style.cursor = "pointer";
          replyButton.append(replyIcon);
          // Append the button to the child element
          if (childElement.tagName === "PRE") {
            // let childDiv = childElement.querySelector("div");
            // if (childDiv) {
            //   // If there is a div inside the pre tag
            //   childDiv.appendChild(replyButton);
            // }
          } else {
            childElement.appendChild(replyButton);
          }
        });
      });
    }, 1000);
  };

  // Create a new style element
  let style = document.createElement("style");

  // Insert it into the head element
  document.head.appendChild(style);

  style.sheet.insertRule(`
  .markdown {
    overflow: hidden; /* or overflow: hidden; based on your preference */
  }
`);
  style.sheet.insertRule(`
  .markdown > p, .markdown > pre {
    position: relative;
    padding-right: 20px; /* Adjust as needed based on the size of your button */
    margin-right: 20px; 
    box-sizing: border-box;
  }
`);

  style.sheet.insertRule(`
  .markdown > *, .markdown > pre > div {
    position: relative;
}   
`);

  style.sheet.insertRule(`
  .reply-button {
    position: absolute;
    top: 0;
    right: -1em;
    display: flex !important; 
    justify-content: center !important;
    align-items: flex-start !important;
    flex-direction: column-reverse;
  }
`);

  style.sheet.insertRule(`
.reply-button:hover {
  background: #e8eaeb;
}
`);

  style.sheet.insertRule(`
.reply-icon {
  position: relative;
  top: 0;
}
`);
})();
