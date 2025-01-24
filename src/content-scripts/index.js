// Import the CSS for styling
import './styles.css';

function injectCSS() {
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL('content-scripts.css');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}


// Function to show a toast notification
function showToast(message) {
  injectCSS();
  
  const toast = document.createElement("div");
  toast.textContent = message; // Set the message text
  toast.classList.add('toast'); // Add 'toast' class for styling
  
  // Append the toast element to the body of the document
  document.body.appendChild(toast);

  // Make the toast visible by changing opacity after a short delay
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);

  // Hide the toast after 3 seconds and then remove it from the DOM
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 500); // Delay the removal to allow the opacity transition to finish
  }, 3000);
}

// Listener for messages from the Chrome extension's background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  if (message.type === "create_popup") {
    showToast(message.message);
    sendResponse({status: "success", message: "Popup displayed"});
  }
  return true;
});
