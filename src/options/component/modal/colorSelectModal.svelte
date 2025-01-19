<script>
    import { onMount } from 'svelte';
    import { insertData, updateData, deleteData } from '../../js/database.js';
    import { createContextMenu, removeContextMenu, updateContextMenu } from '../../js/contextMenus.js';
    import { hideModal } from '../../../service/common.js';
    import { CATEGORY_NAME, CATEGORY_COLOR, CATEGORY_SHORTCUT } from '../../js/constants.js';
    import Switch from '../../../components/switch.svelte';

    export let originalCategory;
    export let isEdit;
    export let categoryList;
    export let visible = false;
    let selectedColor;
    let categoryName;
    let categorySeq;
    let selectedShortcut = null;
    let switchValue = false; // 스위치의 초기값

    const shortcutList = ['1', '2', '3', '4'];
    const colorList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'teal'];

    onMount(() => {
        if(originalCategory){
            selectedColor = originalCategory.categoryColor ?? 'red';
            categoryName = originalCategory.categoryName ?? '';
            categorySeq = originalCategory.categorySeq;
            if(originalCategory.categoryShortcut !== ''){
                selectedShortcut = originalCategory.categoryShortcut;
                switchValue = true;
            }
        }else{
            selectedColor = 'red';
            categoryName = '';
        }
    });
    
    
    function handleSwitchChange(value) {
        console.log('Switch value changed:', value);
        switchValue = value;
        // 여기서 필요한 로직을 추가할 수 있습니다
    }
    function handleKeydown(event) {
        if (event.key === 'Escape') {
            hideModal();
        }
    }
    function onTapConfirm(){
        const newTitle = document.querySelector('input').value;
        if (!newTitle || !selectedColor) {
            alert('Please enter both title and select a color');
            return;
        }
        const categoryData = {
            [CATEGORY_NAME]: newTitle,
            [CATEGORY_COLOR]: selectedColor
        }
        if(switchValue){
            updateCategoryShortcut();
            categoryData[CATEGORY_SHORTCUT] = selectedShortcut;
        }

        if(isEdit === true){
            const currentItem = document.querySelector(`#color-card-${originalCategory.categorySeq}`);
            currentItem.querySelector(".title").innerText = newTitle;
            currentItem.className = `color-card card-${selectedColor}`;

            updateData(originalCategory.categorySeq, categoryData).then((result) => {
                let oldCategory = categoryList.find(item => item.categorySeq === originalCategory.categorySeq);
                oldCategory.categoryName = newTitle;
                oldCategory.categoryColor = selectedColor;

                updateContextMenu(result.categorySeq, newTitle, selectedColor);
            })
            .catch((error) => {
                console.error("Update failed:", error);
            });
        }else{
            insertData(categoryData).then((result) => {
					console.log("Inserted Data:", result);
					createContextMenu(result.categorySeq, newTitle);
                    categoryList.push({
                        categorySeq: result.categorySeq,
                        categoryName: newTitle,
                        categoryColor: selectedColor,
                        categoryShortcut: selectedShortcut
                    });
				})
        }

        console.log(selectedColor);
    }
    
    function updateCategoryShortcut(){
        let index = categoryList.findIndex(item => item.categoryShortcut === selectedShortcut);
        if(index !== -1){
            updateData(categorySeq, { [CATEGORY_SHORTCUT]: '' });
        }
    }
    function onTapDelete(){
        deleteData(categorySeq);
        removeContextMenu(categorySeq);
        document.querySelector(`#color-card-${categorySeq}`).remove();
        hideModal();
    }

    function handleShortcutSelect(shortcut) {
        selectedShortcut = shortcut;
    }
</script>

<style>
    .radio-group {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
    }

    .radio-group label {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        font-family: 'NotoSansMedium', sans-serif;
    }

    .radio-group input[type="radio"] {
        cursor: pointer;
    }
    .category-modal-header{
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        margin-top: 20px;
    }

    .shortcut-header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
</style>

<div class="modal-overlay" class:active={visible}>
    <div class="modal" class:open={visible}>
        <div class="modal-header">
            <h2>{isEdit ? '카테고리 편집' : '카테고리 추가'}</h2>
             <div class="close-icon" id="modal-close" on:click={hideModal} on:keydown={handleKeydown}>
                <img src="assets/images/close.svg" alt="Delete Icon">
            </div>
        </div>
        <div class="modal-body">
            <div class="category-modal-header" style="margin-top: 0;" id="name-header">카테고리 이름</div>
            <div class="input-group">
                <input type="text" placeholder="카테고리명을 입력해주세요" value="{categoryName}">
            </div>
            <div class="category-modal-header" id="color-header">카테고리 색상</div>
            <div class="color-palette">
                {#each colorList as color}   
                    <div class="color-option {color === selectedColor ? 'selected' : ''}" 
                        style="background-color: var(--pastel-{color})" data-color="{color}"
                        on:click={() => selectedColor = color}
                        on:keydown={handleKeydown}
                        >
                    {#if color === selectedColor}
                        <img src="assets/images/check.svg" alt="Checkmark">
                    {/if}
                    </div>
                {/each}
            </div>
            
            <div class="shortcut-header-container">
                <div class="category-modal-header" id="shortcut-header">단축키 카테고리 설정</div>
                <Switch 
                    checked={switchValue} 
                    onChange={handleSwitchChange}
                    topMargin={10}
                />
            </div>
            
            {#if switchValue}
                <div class="radio-group">
                    {#each shortcutList as shortcut}
                        <label>
                            <input 
                                type="radio" 
                                name="options" 
                                value={shortcut}
                                checked={selectedShortcut === shortcut}
                                on:click|preventDefault={() => handleShortcutSelect(shortcut)}
                            >
                            <span>#{shortcut}</span>
                        </label>
                    {/each}
                </div>
            {/if}
        </div>
        <div class="modal-footer">
            {#if isEdit}
                <button class="delete-button" on:click={onTapDelete}>삭제</button>
            {/if}
            <button class="confirm-button" on:click={onTapConfirm}>{isEdit ? '변경' : '추가'}</button>
        </div>
    </div>
</div>