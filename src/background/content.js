function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = `${message}`;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.backgroundColor = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.5s";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}



// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.type === "create_popup") {
    console.log("Popup message received:", message.message);
    showToast(message.message); // Run the popup function with the message
  }
});
