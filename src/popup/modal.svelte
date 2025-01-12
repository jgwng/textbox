<script>
    import {deleteData } from '../background/database.js';

    export let entry;
    export let category;
    export let onRefresh;

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
    async function handleDelete(id, cardElement) {
        try {
            await deleteData(id);
            console.log("Entry deleted successfully!");
            cardElement.style.transition = "opacity 0.3s ease";
            cardElement.style.opacity = "0";

            setTimeout(() => {
            cardElement.remove();
            const resultList = document.getElementById("resultList");
            if (resultList.children.length === 0) {
                onRefresh();
            }
            }, 300);

        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    }
  </script>
  
  <style>
    .modal-container {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 20px 100px rgba(0, 0, 0, 0.2);
      position: relative;
    }
  
    .modal-close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.5rem;
      cursor: pointer;
      color: #aaa;
      border: none;
      background: transparent;
    }
  
    .modal-close:hover {
      color: black;
    }
  
    .modal-content {
      margin-bottom: 1rem;
      color: #333;
      font-size: 1rem;
      line-height: 1.6;
    }
  
    .modal-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #eee;
      margin: 0 -2rem -2rem -2rem;
    }
  
    .modal-footer button {
      width: 50%;
      height: 48px;
      padding: 0.8rem;
      border: none;
      background: #f7f7f7;
      color: #555;
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  
    #button1 {
      border-bottom-left-radius: 12px;
    }
    #button2 {
      border-bottom-right-radius: 12px;
    }
    .modal-footer button:hover {
      background: #eee;
    }
  </style>
  
  <div class="modal-container" style="position: relative; background-color: var(--pastel-{category?.categoryColor})">
    <button class="modal-close"
    on:click={(e) => handleDelete(entry.id, e.currentTarget.closest('.modal-container'))}>&times;</button>
    <div class="modal-content">{entry.selectionText}</div>
    <div class="modal-footer">
      <button on:click={() => moveToLink(entry.pageUrl, entry.selectionText)} id="button1">링크 열기</button>
      <button on:click={() => copyText(entry.selectionText)} id="button2">복사하기</button>
    </div>
  </div>
  