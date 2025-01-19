<script>
    import { onMount } from 'svelte';
    import {getAllCategoryData} from '../../../options/js/database.js';
    import '../../../styles/bottomSheet.css';
    import {hideBottomSheet} from '../../../service/common.js';

    let categories = [];
    let selectedCategory = null;

    export let currentCategory;
    export let onEdit;
    onMount(async() => {
       categories = await getAllCategoryData();
       console.log(categories);
       selectedCategory = currentCategory;
    });

   
</script>

<div>
    <div class="category-list">
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
    </div>
    <div class="category-sheet-footer">
        <button class="category-sheet-footer-button" on:click={hideBottomSheet}>취소</button>
        <button class="category-sheet-footer-button" on:click={() => onEdit(selectedCategory)}>변경</button>
    </div>    
</div>