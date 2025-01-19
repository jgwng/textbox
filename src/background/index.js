import { insertData } from './database.js';
import { insertDefaultData, getMacroData } from '/options/js/database.js';
import { DEFAULT_CATEGORY_DATA} from '../database/constants.js';
// Listener for context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {

  if (info.menuItemId === "openOptions") {
    chrome.runtime.openOptionsPage();
  } else if (info.menuItemId !== "") {
    // Create the message object
    console.log("info.menuItemId", info.menuItemId);
    const message = {
      selectionText: info.selectionText || "No text selected",
      pageUrl: info.pageUrl || "Unknown page",
      category: info.menuItemId.toString(),
      timestamp: new Date().toISOString(), // Add a timestamp
    };
    // Save the message to IndexedDB
    saveData(message);
  }
});
const saveData = async (message) => {
  var result = await insertData(message);
  let popupMessage = "저장 성공";
  if (result === false) {
    popupMessage = "저장 실패";
  }
  sendMessage(popupMessage);
}
function sendMessage(popupMessage) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;

      // Inject the content script before sending the message
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ["content-scripts.js"], // Make sure "content.js" is the correct path
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Error injecting content script:", chrome.runtime.lastError.message);
          } else {
            // Send the message after the content script is injected
            chrome.tabs.sendMessage(tabId, { type: "create_popup", message: popupMessage }, (response) => {
              if (chrome.runtime.lastError) {
                console.error("Error sending message to content script:", chrome.runtime.lastError.message);
              } else {
                console.log("Message sent to content script:", response);
              }
            });
          }
        }
      );
    } else {
      console.error("No active tab found.");
    }
  });
}

const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) throw new Error("No active tab found");
  return tab;
};

const scrollToSpecificText = (targetText, color) => {
  const body = document.body;
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, false);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const index = node.nodeValue.indexOf(targetText);

    if (index !== -1) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + targetText.length);
      const rect = range.getBoundingClientRect();

      window.scrollTo({ top: rect.top + window.scrollY - 100, behavior: "smooth" });

      const span = document.createElement("span");
      span.style.backgroundColor = color;
      span.textContent = targetText;

      range.deleteContents();
      range.insertNode(span);

      return true;
    }
  }
  console.log(`Text not found: "${targetText}"`);
  return false;
};

async function scrollTarget(target, pageUrl, color) {
  const activeTab = await getActiveTab();

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (tabs[0]) {
      const tabId = tabs[0].id;

      // Update the tab URL
      chrome.tabs.update(tabId, { url: pageUrl }, function () {
        // Listen for the tab's status to change to "complete"
        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
          if (updatedTabId === tabId && changeInfo.status === "complete") {
            // Tab has finished loading the new URL

            // Remove the listener to avoid unnecessary calls
            chrome.tabs.onUpdated.removeListener(listener);

            // Execute the script
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: scrollToSpecificText,
              args: [target, color], // Pass the target text as an argument
            });
          }
        });
      });
    }
  });
}
// Create the context menu on extension installation

// chrome.tabs.onUpdated.addListener(
//   async (tabId, changeInfo, tab) => {
//     console.log('Updated to URL:', tab.url);
//     console.log('Updated to tabId:', tabId);
//     console.log('Updated to changeInfo:', changeInfo);

//     // Execute script to check dark mode
//     if (changeInfo.status === 'complete') {
//       try {
//         const [{result}] = await chrome.scripting.executeScript({
//           target: { tabId: tabId },
//           func: () => {
//             return window.matchMedia('(prefers-color-scheme: dark)').matches;
//           }
//         });
//         console.log('Is Dark Mode:', result);
//         // You can store this result or use it as needed
//       } catch (err) {
//         console.error('Failed to detect dark mode:', err);
//       }
//     }
//   }
// );

chrome.runtime.onInstalled.addListener(() => {
  insertDefaultData(DEFAULT_CATEGORY_DATA);

  DEFAULT_CATEGORY_DATA.forEach((data, index) => {
    chrome.contextMenus.create({
      id: (index + 1).toString(),
      title: data.categoryName,
      contexts: ["selection"],
    });
  });
  chrome.contextMenus.create({
    id: "separator",
    type: "separator", // Specifies that this item is a separator
    contexts: ["all"], // Apply the separator in all contexts
  });
  chrome.contextMenus.create({
    id: "openOptions",
    title: "설정 열기", // Context menu item title
    contexts: ["all"], // Show this menu item everywhere
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "scrollText":
      const target = message.target || '';
      const url = message.url || '';
      const color = message.color || 'yellow';
      scrollTarget(target, url, color);
      return true;
    case "createPopup":
      const content = message.popupMessage || '';
      sendMessage(content);
      return true;
    case "createTab":
      const text = message.menuName || '';
      createSubMenu();
      return true;
    case "openSidePanel":
      chrome.sidePanel.open({ tabId: sender.tab.id });
      return true;
  }
});

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    if (tabs.length === 0) {
      return;
    }
    const tabId = tabs[0].id;
    const selection = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => getSelection().toString()
    });
    console.log(selection);
    const selectedText = selection[0].result;
    if (!selectedText.trim()) {
      console.log("No text selected, skipping command execution.");
      return; // Exit if no text is selected
    }
    const url = tabs[0].url;
    switch (command) {
      case "SAVE_1":
        saveDataMacroNo(1, selectedText, url);
        break;
      case "SAVE_2":
        saveDataMacroNo(2, selectedText, url);
        break;
      case "SAVE_3":
        saveDataMacroNo(3, selectedText, url);
        break;
      case "SAVE_4":
        saveDataMacroNo(4, selectedText, url);
        break;
    }
  });
});

async function saveDataMacroNo(macroNo, selectionText, pageUrl) {
  var categorySeq = await getMacroData(macroNo);  // Ensure getMacroData is correctly implemented
  const message = {
    selectionText: selectionText || "No text selected",
    pageUrl: pageUrl || "Unknown page",
    category: `${categorySeq}`,
    timestamp: new Date().toISOString(), // Add a timestamp
  };
  saveData(message);
  console.log(message); // Log or save the message as needed
  // Implement the actual save logic here
}
