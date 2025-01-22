<script>
    import { removeContextMenu } from '../../js/contextMenus.js';
	import { deleteData } from '../../../database/categoryDB.js';
    
    export let category;
    export let onClickItem;
    export let changeDisplay;
    function handleKeydown(event) {
        if (event.key === 'Escape') {
        }
    }
    
    function onDeleteItem(event){
        event.stopPropagation();
        deleteData(category.categorySeq);
        removeContextMenu(category.categorySeq);
        document.querySelector(`#color-card-${category.categorySeq}`).remove();
        
        const serviceContainer = document.getElementById("colorList");
        if (serviceContainer.children.length === 0) {
            changeDisplay(true);
        }
    }
</script>


<div class="color-card card-{category.categoryColor}" id="color-card-{category.categorySeq}"
on:click={onClickItem} on:keydown={handleKeydown}>
    <div class="text-content">
        <p class="title">{category.categoryName}</p>
    </div>
    <div class="close-icon" id="close" on:click={onDeleteItem} on:keydown={handleKeydown}>
        <img src="assets/images/close.svg" alt="Delete Icon">
    </div>
</div>
