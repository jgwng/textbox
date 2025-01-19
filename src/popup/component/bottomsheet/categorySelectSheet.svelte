<script>
    import { onMount } from 'svelte';
    import {getAllCategoryData} from '../../../options/js/database.js';
    import '../../../styles/bottomSheet.css';
    import {hideBottomSheet} from '../../../service/common.js';

    let categories = [];
    export let onFilterSelect;
    export let selectedCategories;

    onMount(async() => {
       categories = await getAllCategoryData();
       console.log(categories);
    });

    function onCategorySelect(category) {
        console.log(category);
        const index = selectedCategories.findIndex(c => c.categoryName === category.categoryName);
        if (index !== -1) {
            selectedCategories = [
                ...selectedCategories.slice(0, index),
                ...selectedCategories.slice(index + 1)
            ];
        } else {
            selectedCategories = [...selectedCategories, category];
            if(selectedCategories.length === categories.length) {
                selectedCategories = [];
            }
        }
        console.log(selectedCategories);
    }
    function onFilterChange() {
        hideBottomSheet();
        onFilterSelect(selectedCategories);
    }
</script>

<div class="category-list">
        {#each categories as category}
        <button class="category-item" 
            style="background-color: var(--pastel-{category?.categoryColor})"
            on:click={() => onCategorySelect(category)}>   
            <span>{category.categoryName}</span>
            {#if selectedCategories.some(c => c.categoryName === category.categoryName)}
                <img src="../../../assets/images/check.svg" class="check-icon" alt="선택됨"/>
            {/if}
        </button>
    
        {/each}
        </div>
    <div class="category-sheet-footer">
        <button class="category-sheet-footer-button" on:click={hideBottomSheet}>취소</button>
        <button class="category-sheet-footer-button" on:click={onFilterChange}>변경</button>
    </div>    