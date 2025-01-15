<script>
    import { onMount } from 'svelte';
    import { insertData, updateData, deleteData, getAllCategoryData } from '../../js/database.js';
    import { createContextMenu, removeContextMenu, removeAllContextMenu, updateContextMenu } from '../../js/contextMenus.js';
    import { hideModal } from '../../../service/common.js';
    export let originalCategory;
    export let isEdit;
    export let categoryList;
    export let visible = false;
    let selectedColor;
    let categoryName;
    let categorySeq;
    const colorList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'teal'];

    onMount(() => {
        selectedColor = originalCategory.categoryColor;
        categoryName = originalCategory.categoryName;
        categorySeq = originalCategory.categorySeq;
    });

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
        if(isEdit === true){
            const currentItem = document.querySelector(`#color-card-${originalCategory.categorySeq}`);
            currentItem.querySelector(".title").innerText = newTitle;
            currentItem.className = `color-card card-${selectedColor}`;
            updateData(originalCategory.categorySeq, { [CATEGORY_NAME]: newTitle, [CATEGORY_COLOR]: selectedColor }).then((result) => {
                
                let oldCategory = categoryList.find(item => item.categorySeq === originalCategory.categorySeq);
                oldCategory.categoryName = newTitle;
                oldCategory.categoryColor = selectedColor;

                updateContextMenu(result.categorySeq, newTitle, selectedColor);
            })
            .catch((error) => {
                console.error("Update failed:", error);
            });
        }else{
            insertData({ [CATEGORY_NAME]: newTitle, [CATEGORY_COLOR]: selectedColor }).then((result) => {
					console.log("Inserted Data:", result);
					createContextMenu(result.categorySeq, newTitle);
                    categoryList.push({
                        categorySeq: result.categorySeq,
                        categoryName: newTitle,
                        categoryColor: selectedColor
                    });
				})
        }

        console.log(selectedColor);
    }
    
    function onTapDelete(){
        deleteData(categorySeq);
        removeContextMenu(categorySeq);
        document.querySelector(`#color-card-${categorySeq}`).remove();
        hideModal();
    }
</script>

<div class="modal-overlay" class:active={visible}>
    <div class="modal" class:open={visible}>
        <div class="modal-header">
            <h2>{isEdit ? 'Edit' : 'Add'} Color</h2>
             <div class="close-icon" id="modal-close" on:click={hideModal} on:keydown={handleKeydown}>
                <img src="assets/images/close.svg" alt="Delete Icon">
            </div>
        </div>
        <div class="modal-body">
            <div class="input-group">
                <input type="text" placeholder="Enter color name..." value="{categoryName}">
            </div>
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
        </div>
        <div class="modal-footer">
            {#if isEdit}
                <button class="delete-button" on:click={onTapDelete}>Delete</button>
            {/if}
            <button class="confirm-button" on:click={onTapConfirm}>{isEdit ? 'Update' : 'Add'}</button>
        </div>
    </div>
</div>