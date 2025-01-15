<script>
    import {deleteData, updateData} from '../../../background/database.js';
    import OptionSheet from '../bottomsheet/optionsheet.svelte';  
    import {openBottomSheet,hideBottomSheet,getCSSVariableValue} from '../../../service/common.js';
    import CategoryChangeSheet from '../bottomsheet/categoryChangeSheet.svelte';
    export let entry;
    export let category;
    export let onRefresh;

    async function moveToLink(url, text) {
        const categoryColor = category?.categoryColor ?? 'red';
        const color = getCSSVariableValue(`--pastel-${categoryColor}`);

        const promise = new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({ type: "scrollText", target: text, url: url,color: color }, function (response) {
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

    async function handleModify(id, cardElement, category) {
        try {
            let newCategory = {
              category: category.categorySeq,
            };
            
            var result = await updateData(id, newCategory);
            if(result === true) {
              entry.category = category.categorySeq;
              cardElement.style.backgroundColor = `var(--pastel-${category.categoryColor})`;
            }
            hideBottomSheet();
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    }

    function handleEdit() {
        openBottomSheet(CategoryChangeSheet, {
            onEdit: (category) => {
                handleModify(entry.id, document.querySelector(`#card-${entry.id}`), category);
            },
            currentCategory: category
        },"카테고리 변경");
    }

    function onTapMoreButton() {
      openBottomSheet(OptionSheet, {
          onDelete: () => {
              handleDelete(entry.id, document.querySelector(`#card-${entry.id}`));
          },
          onEdit: () => {
              handleEdit();
          }
      },"더보기");
    }

  </script>
  
  <style>
    .card-container {
      background: white;
      border-radius: 12px;
      box-shadow: var(--card-shadow);
      position: relative;
      font-family: 'GmarketSansMedium', sans-serif;
    }
  
    .card-more {
      position: absolute;
      top: 12px;
      right: 6px;
      cursor: pointer;
      color: #aaa;
      border: none;
      background: transparent;
    }

    .card-more img {
      width: 20px;
      height: 20px;
      filter: invert(40%);
      transition: filter 0.2s ease;
    }
  
    .card-more:hover {
      color: black;
    }
  
    .card-more:hover img {
      filter: invert(0%);
    }
  
    .card-content {
      color: #333;
      font-size: 0.9rem;
      padding: 2rem 1.5rem 1rem;
      line-height: 1.6;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
    }

    .text-content {
      margin-bottom: 1rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      margin-top: auto;
      margin: 0rem -1.5rem -1rem;
    }
  
    .card-footer button {
      width: 50%;
      height: 48px;
      padding: 0.8rem;
      border: none;
      background: #FFFFFF;
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
      border-right: 1px solid #E5E6E9;
    }
    #button2 {
      border-bottom-right-radius: 12px;
    }
    .card-footer button:hover {
      background: #eee;
    }
  </style>
  
  <div class="card-container"
    id="card-{entry.id}" 
    style="background-color: var(--pastel-{category?.categoryColor ?? 'red'})">
    <button class="card-more" on:click={onTapMoreButton}>
      <img src="../../../assets/images/more.svg" alt="more" />
    </button>
    <div class="card-content">
      <div class="text-content">{entry.selectionText}</div>
      <div class="card-footer">
        <button on:click={() => moveToLink(entry.pageUrl, entry.selectionText)} id="button1">링크 열기</button>
        <button on:click={() => copyText(entry.selectionText)} id="button2">복사하기</button>
      </div>
    </div>
  </div>
  