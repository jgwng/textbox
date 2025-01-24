<script>
	import { insertData, updateData, deleteData, getAllCategoryData } from '../database/categoryDB.js';
	import { CATEGORY_NAME, CATEGORY_COLOR } from '../database/constants.js';
	import { createContextMenu, removeContextMenu, removeAllContextMenu, updateContextMenu } from './js/contextMenus.js';
	import { onMount } from 'svelte';
	import CategoryItem from './component/card/categoryCard.svelte';
	import { showModal, hideModal } from '../service/common.js';

	let categoryList = [];
	onMount(async () => {
		window.addEventListener("keydown", (e) => {
			if (e.key === 'Escape') {
					hideModal();
			}
		});

		const data = await getAllCategoryData();
		categoryList = data;
	});


	function onClickItem(category) {
		showModal({
			originalCategory: category,
			categoryList: categoryList,
			isEdit: true,
		})
	}

</script>

<div class="options-header" id="options-header">
	<h1>텍스트박스 설정</h1>
</div>
<div class="container" style="display : {categoryList.length !== 0 ? '' : 'flex'}">
	<div class="category-header">
		카테고리 관리
		<div class="add" id="add" on:click={() => showModal({ isEdit: false })}>추가</div>
	</div>
	{#if categoryList.length !== 0}
	<div id="colorList" class="color-container" >
		{#each categoryList as category}
			<CategoryItem category={category} onClickItem={() => onClickItem(category)}  />
		{/each}
	</div>
	{:else}
	<div class="empty-message" id="emptyMessage">
		<p>카테고리가 없습니다.</p>
	</div>
	{/if}
	<div id="modal"></div>
</div>