import { getAllData, deleteData, deleteAllData } from '../background/database.js';

var displayDataAsList = (data) => {
  const resultList = document.getElementById("resultList");
  resultList.innerHTML = "";

  // Add check for empty data
  if (!data || data.length === 0) {
    showEmptyMessage();
    return;
  }

  data.forEach((entry) => {
    // Create card structure
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.position = "relative";  // Add positioning for absolute child

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "×";
    deleteBtn.title = "텍스트 제거";
    deleteBtn.onclick = () => handleDelete(entry.id, card);
    card.appendChild(deleteBtn);

    // Create message paragraph
    const message = document.createElement("p");
    message.classList.add("message");
    message.textContent = entry.selectionText;

    // Create actions container
    const actions = document.createElement("div");
    actions.classList.add("actions");

    // Create "Take a Look" link
    const readLink = document.createElement("a");
    readLink.classList.add("link");
    readLink.href = "#";
    readLink.textContent = "링크 열기";
    readLink.onclick = (event) => moveToLink(entry.pageUrl, entry.selectionText);

    // Create "Mark as Read" link
    const markAsReadLink = document.createElement("a");
    markAsReadLink.classList.add("clipboard");
    markAsReadLink.href = "#";
    markAsReadLink.textContent = "복사하기";
    markAsReadLink.onclick = (event) => copyText(entry.selectionText);

    // Assemble the elements
    actions.appendChild(readLink);
    actions.appendChild(markAsReadLink);
    card.appendChild(message);
    card.appendChild(actions);
    resultList.appendChild(card);
  });
};

function copyText(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      const message = "텍스트를 복사했습니다!";
      chrome.runtime.sendMessage(
        { type: "createPopup", popupMessage: message },
        (response) => {
          console.log("Popup created:", response);
        }
      );
    },
    (err) => {
      const message = "텍스트를 복사하지 못했습니다.";
      chrome.runtime.sendMessage(
        { type: "createPopup", popupMessage: message },
        (response) => {
          console.log("Popup failed:", response);
        }
      );
    }
  );
}


async function moveToLink(url, text) {
  console.log("scrollText -- web/index.js");
  const promise = new Promise(function (resolve, reject) {
    chrome.runtime.sendMessage({ type: "scrollText", target: text, url: url }, function (response) {
      resolve(response);
    });
  })

  const selection = await promise;
  if (selection) {
    return selection[0].result ?? '';
  }
  return '';
}


// Modified handler functions
async function handleDelete(id, cardElement) {
  try {
    await deleteData(id);
    console.log("Entry deleted successfully!");

    // Remove the card element with animation
    cardElement.style.transition = "opacity 0.3s ease";
    cardElement.style.opacity = "0";

    setTimeout(() => {
      cardElement.remove();
      const resultList = document.getElementById("resultList");
      if (resultList.children.length === 0) {
        updateDeleteAllBtnVisibility(false);
        showEmptyMessage();
      }
    }, 300);

  } catch (error) {
    console.error("Error deleting entry:", error);
  }
}

function showEmptyMessage() {
  const resultList = document.getElementById("resultList");
  const emptyMessage = document.getElementById("emptyMessage");
  emptyMessage.textContent = "저장된 글이 없습니다";
  emptyMessage.style.display = "flex";
  resultList.style.display = "none";
}

async function deleteAllDataFromList() {
  try {
    await deleteAllData();
    const resultList = document.getElementById("resultList");

    // Add transition to the entire resultList
    resultList.style.transition = "opacity 0.3s ease";
    resultList.style.opacity = "0";

    setTimeout(() => {
      resultList.innerHTML = "";
      showEmptyMessage();
      updateDeleteAllBtnVisibility(false);
      resultList.style.opacity = "1";
    }, 300);

  } catch (error) {
    console.error("Error deleting all entries:", error);
  }
}

const updateDeleteAllBtnVisibility = (hasData) => {
  const deleteAllBtn = document.getElementById("deleteAllBtn");
  deleteAllBtn.style.display = hasData ? "block" : "none";
};

document.addEventListener('DOMContentLoaded', async function () {
  document.getElementById("deleteAllBtn").addEventListener("click", deleteAllDataFromList);
  // Initial data load
  const data = await getAllData();
  let hasData = data && data.length > 0;
  if (hasData) {
    updateDeleteAllBtnVisibility(true);
    displayDataAsList(data);
  } else {
    updateDeleteAllBtnVisibility(false);
    showEmptyMessage();
  }
});