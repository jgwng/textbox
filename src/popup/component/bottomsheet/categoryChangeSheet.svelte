<script>
    import { onMount } from 'svelte';
    import {getAllCategoryData} from '../../../options/js/database.js';
    
    import {hideBottomSheet} from '../../../service/common.js';

    let categories = [];
    let selectedCategory = null;

    export let currentCategory;
    export let onEdit;
    onMount(async() => {
       categories = await getAllCategoryData();
       selectedCategory = currentCategory;
    });

   
</script>

<style>
    .category-item {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        border-radius: 10px;
        margin-bottom: 10px;
        border: none;
        cursor: pointer;
        background: none;
        text-align: left;
        
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: calc(60vh - 72px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .category-sheet-footer {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        gap: 10px;
    }

    .category-sheet-footer-button {
        width: 50%;
        height: 100%; 
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        border: none;
        margin-bottom: 10px;
    }

    .check-icon {
        width: 20px;
        height: 20px;
    }

</style>
<div>
    <ul>
        {#each categories as category}
            <button 
                class="category-item" 
                style="background-color: var(--pastel-{category?.categoryColor})"
                on:click={() => selectedCategory = category}
            >
                <span>{category.categoryName}</span>
                {#if selectedCategory.categorySeq === category.categorySeq}
                    <img src="../../../assets/images/check.svg" class="check-icon" alt="선택됨"/>
                {/if}
            </button>
        {/each}
    </ul>
    <div class="category-sheet-footer">
        <button class="category-sheet-footer-button" on:click={hideBottomSheet}>취소</button>
        <button class="category-sheet-footer-button" on:click={() => onEdit(selectedCategory)}>변경</button>
    </div>    
</div>