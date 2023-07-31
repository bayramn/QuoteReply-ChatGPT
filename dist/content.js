/*global chrome*/

(async () => {
  console.log("Content script is running!");
  let previousChildrenCount = 0;
  let observerInterval;
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
        //console.log(mutation, mutationsList);
        //console.log("mutationsList.length: ", mutationsList.length);
        // Check if there are new nodes added
        if (mutation.addedNodes.length > 0) {
          //console.log("Detected new chat response...");
          mutation.addedNodes.forEach((node) => {
            //console.log(node);
            // Check if the added node is an svg with classes 'h-6' and 'w-6'
            // if (
            //   node.nodeName.toLowerCase() === "svg" &&
            //   node.classList.contains("h-6") &&
            //   node.classList.contains("w-6")
            // ) {
            //   console.log("Detected the svg.h-6.w-6 element");
            //   // Do your processing here
            // }
            // if (
            //   node.nodeName.toLowerCase() === "button" &&
            //   node.firstChild.nodeName.toLowerCase() === "svg" &&
            //   node.firstChild.classList.contains("h-4") &&
            //   node.firstChild.classList.contains("w-4")
            //   // &&
            //   // node.nextSibling === null
            // ) {
            //   // Check if there's no next sibling
            //   console.log(
            //     "Detected the last svg.h-4.w-4 element within a button"
            //   );
            //   // Do your processing here
            // }
            // if (node.nodeType === Node.ELEMENT_NODE) {
            //   // check if the added node has a nested child 'svg.h-4.w-4'
            //   let svgNode = node.querySelector("svg.h-4.w-4");
            //   if (svgNode) {
            //     console.log("Detected svg.h-4.w-4 in added node");
            //     // Add your logic here
            //   }
            // }
          });
        }

        if (mutation.type === "attributes") {
          // console.log(
          //   "Attribute changed: ",
          //   mutation.target.parentNode.lastElementChild
          // );
          // console.log(
          //   "Attribute changed: ",
          //   mutation.target.childNodes[0].nodeName
          // );
          if (mutation.target === mutation.target.parentNode.lastElementChild)
            if (
              //mutation.target.childNodes[0].nodeName === "BUTTON" &&
              mutation.target.className ===
              "text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-2 md:gap-3 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible"
            ) {
              console.log("SVG buttons are visible..");
              observer.disconnect();
              addInitialReplyButtons(0);
              // Add your logic here
            }
        }
      }
    });
    //console.log("chatContainer: ", chatContainer);
    observer.observe(chatContainer, {
      attributes: true,
      childList: true,
      subtree: true,
      // characterData: true,
    });
    // clearInterval(observerInterval);
    // observerInterval = setInterval(() => {
    //   let chatContainer = document.querySelectorAll(".markdown"); // replace '.markdown' with actual chat container selector

    //   // console.log("chatContainer: ", chatContainer);
    //   console.log(chatContainer.length, previousChildrenCount);
    //   if (chatContainer.length > previousChildrenCount) {
    //     console.log("The number of children has changed");
    //     previousChildrenCount = chatContainer.length;
    //     addInitialReplyButtons(5000);
    //     // add reply buttons or do whatever you need
    //   }
    // }, 1000); // check every half second
  }
  const newChatLoaded = () => {
    // Setting timeout so that all .markdown children added
    //setTimeout(() => {
    // Check if the chat container exists
    let chatContainer = document.querySelector(
      ".flex.flex-col.text-sm.dark\\:bg-gray-800"
    ); // replace '.markdown' with actual chat container selector
    if (chatContainer) {
      // If it exists, start the observer
      startObserver(chatContainer);
    } else {
      // If it doesn't exist, set up an interval to check until it does exist
      setTimeout(() => {
        //let checkExist = setInterval(function () {
        chatContainer = document.querySelector(
          ".flex.flex-col.text-sm.dark\\:bg-gray-800"
        );
        if (chatContainer) {
          console.log("Checking chatContainer...");
          // When it exists, start the observer and clear the interval
          addInitialReplyButtons(0);
          // clearInterval(checkExist);
        }
      }, 2000); // Check every 100ms
    }
    // }, 1000);
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
        replyButton.addEventListener("click", function () {
          // Get the text content of the parent element
          let parentText = childElement.textContent || childElement.innerText;
          // Log or use the text
          console.log(parentText);
        });
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
  const addInitialReplyButtons = (timeout) => {
    setTimeout(() => {
      // Select all elements with class "markdown"
      let markdownDivs = document.querySelectorAll(".markdown");
      previousChildrenCount = markdownDivs.length;

      // Loop through each "markdown" div
      markdownDivs.forEach((markdownDiv) => {
        // Select all direct child p and pre elements
        let childElements = markdownDiv.querySelectorAll(
          ":scope > p, :scope > pre, :scope > ol, :scope > strong, :scope > li"
        );
        // Loop through each child element and append a button
        childElements.forEach((childElement) => {
          // Create a new button
          let replyButton = document.createElement("div");
          let replyIcon = document.createElement("img");
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

          replyButton.addEventListener("click", function () {
            // Get the text content of the parent element
            let parentText = childElement.textContent || childElement.innerText;
            // Log or use the text
            //console.log(parentText);
            simulateTyping(parentText);
          });

          // childElement.addEventListener("dblclick", function () {
          //   let elementText =
          //     childElement.textContent || childElement.innerText;
          //   console.log(elementText);
          // });

          // Append the button to the child element
          if (childElement.tagName === "PRE") {
            // let childDiv = childElement.querySelector("div");
            // if (childDiv) {
            //   // If there is a div inside the pre tag
            //   childDiv.appendChild(replyButton);
            // }
          } else if (childElement.tagName === "OL") {
            // If it is, get all of its 'li' children
            let liElements = childElement.querySelectorAll("li");
            //console.log(liElements);
            // For each 'li', create a reply button and append it
            liElements.forEach((li) => {
              let liReplyButton = document.createElement("div");
              let liReplyIcon = document.createElement("img");

              liReplyButton.style.padding = "0.25em";
              liReplyButton.style.borderRadius = "20px";
              liReplyButton.style.width = "25px";
              liReplyButton.style.height = "25px";
              liReplyButton.className = "li-reply-button"; // Add any classes you want for styling
              liReplyButton.title = "Reply Button";

              liReplyIcon.src = chrome.runtime.getURL("assets/reply.svg");
              liReplyIcon.as = "image";
              liReplyIcon.style.width = "20px";
              liReplyIcon.className = "li-reply-icon";
              liReplyIcon.style.cursor = "pointer";
              liReplyButton.append(liReplyIcon);
              // Append the reply button to the 'li'
              li.appendChild(liReplyButton);
              //console.log("li: ", li);
              liReplyButton.addEventListener("click", function () {
                // Get the text content of the parent element
                let elementText = li.textContent || li.innerText;
                // Log or use the text
                //console.log(parentText);
                simulateTyping(elementText);
              });
              li.addEventListener("mouseenter", function () {
                // Add a border to the parent element when the mouse hovers over the button
                //childElement.style.border = "1px solid black";
                li.style.borderRadius = "15px";

                // Or change the background color
                //childElement.style.backgroundColor = "#e8eaeb"; // Light gray background
                li.style.backgroundColor = "#edf0f2"; // Light gray background
              });

              li.addEventListener("mouseleave", function () {
                // Remove the border when the mouse leaves the button
                //li.style.border = "";
                // And reset the background color
                li.style.backgroundColor = "";
              });
            });
          } else {
            childElement.addEventListener("mouseenter", function () {
              // Add a border to the parent element when the mouse hovers over the button
              //childElement.style.border = "1px solid black";
              childElement.style.borderRadius = "15px";

              // Or change the background color
              //childElement.style.backgroundColor = "#e8eaeb"; // Light gray background
              childElement.style.backgroundColor = "#edf0f2"; // Light gray background
            });

            childElement.addEventListener("mouseleave", function () {
              // Remove the border when the mouse leaves the button
              childElement.style.border = "";
              // And reset the background color
              childElement.style.backgroundColor = "";
            });
            childElement.appendChild(replyButton);
          }
        });
      });
      let chatContainer = document.querySelector(
        ".flex.flex-col.text-sm.dark\\:bg-gray-800"
      );
      startObserver(chatContainer);
    }, timeout);
  };

  function simulateTyping(text) {
    //const message = arguments[0];
    const textarea = document.querySelector("#prompt-textarea");
    textarea.focus();
    textarea.select();
    document.execCommand("insertText", false, `In response to: "${text}"\n\n`);
    //document.querySelector("#prompt-textarea").nextElementSibling.click();
  }
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
  .markdown > p, .markdown > pre, .markdown > strong, .markdown > ol > li {
    position: relative;
    padding-right: 20px; /* Adjust as needed based on the size of your button */
    margin-right: 30px; 
    padding: 10px;
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
    right: 0;
    display: flex !important; 
    justify-content: center !important;
    align-items: flex-start !important;
    flex-direction: column-reverse;
  }
`);

  style.sheet.insertRule(`
.li-reply-button {
  position: absolute;
  //top: 0;
  right: 0;
  display: flex !important; 
  flex-direction: column-reverse;
  // justify-content: center !important;
  // align-items: flex-start !important;
}
`);
  style.sheet.insertRule(`
.reply-button:hover {
  background: #d2d3d4;
}
`);
  //   style.sheet.insertRule(`
  // .li-reply-button:hover {
  //   background: #d2d3d4;
  // }
  // `);

  style.sheet.insertRule(`
.reply-icon, .li-reply-icon {
  position: relative;
  top: 0;
}
`);
})();
