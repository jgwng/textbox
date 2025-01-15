<script>
	import { createModalHTML, createCardHTML } from './js/template.js';
	import { insertData, updateData, deleteData, getAllCategoryData } from './js/database.js';
	import { CATEGORY_NAME, CATEGORY_COLOR } from './js/constants.js';
	import { createContextMenu, removeContextMenu, removeAllContextMenu, updateContextMenu } from './js/contextMenus.js';
	import { onMount } from 'svelte';
	import CategoryItem from './component/card/categoryCard.svelte';
	import { showModal } from '../service/common.js';
	let serviceContainer;
	let emptyMessage;
	let container;
	let modal;
	let categoryList = [];
	onMount(async () => {
		serviceContainer = document.getElementById("colorList");
		emptyMessage = document.getElementById("emptyMessage");
		container = document.querySelector('.container');
		modal = document.querySelector('.modal-overlay');

		const data = await getAllCategoryData();
		let isEmpty = data.length === 0;
		changeDisplay(isEmpty);
		categoryList = data;
	});

	// function showModal({ clickedItem = null, isEdit = true } = {}) {
	// 	let currentTitle = '';
	// 	let currentColor = '';

	// 	if (isEdit && clickedItem) {
	// 		currentTitle = clickedItem.querySelector(".title").innerText;
	// 		currentColor = Array.from(clickedItem.classList)
	// 			.find(cls => cls.startsWith('card-'))
	// 			?.replace('card-', '') || '';
	// 	}
	// 	// Create modal HTML using the template
	// 	const modalHTML = createModalHTML({ 
	// 		title: currentTitle, 
	// 		color: currentColor, 
	// 		isEdit 
	// 	});

	// 	// Add modal to body
	// 	document.body.insertAdjacentHTML('beforeend', modalHTML);
	// 	const closeBtn = modal.querySelector('.close-icon');
	// 	const confirmBtn = modal.querySelector('.confirm-button');
	// 	const colorOptions = modal.querySelectorAll('.color-option');
	// 	let selectedColor = currentColor;

	// 	// Add event listeners
	// 	closeBtn.addEventListener('click', () => {
	// 		modal.remove();
	// 	});

	// 	if (currentColor) {
	// 		const selectedOption = modal.querySelector(`.color-option[data-color="${currentColor}"]`);
	// 		if (selectedOption) {
	// 			selectedOption.innerHTML = `<img src="assets/images/check.svg" alt="Checkmark">`;
	// 		}
	// 	}

	// 	colorOptions.forEach(option => {
	// 		option.addEventListener('click', () => {
	// 			// Remove selected class and check icon from all options
	// 			colorOptions.forEach(opt => {
	// 				opt.classList.remove('selected');
	// 				opt.innerHTML = '';
	// 			});
	// 			// Add selected class and check icon to clicked option
	// 			option.classList.add('selected');
	// 			option.innerHTML = `<img src="assets/images/check.svg" alt="Checkmark">`;
	// 			selectedColor = option.dataset.color;
	// 		});
	// 	});

	// 	confirmBtn.addEventListener('click', () => {
	// 		onTapConfirm(isEdit,clickedItem,selectedColor);
	// 	});

	// 	// Close modal when clicking overlay
	// 	modal.addEventListener('click', (e) => {
	// 		if (e.target === modal) {
	// 			modal.remove();
	// 		}
	// 	});

	// 	if (isEdit) {
	// 		const deleteBtn = modal.querySelector('.delete-button');
	// 		deleteBtn.addEventListener('click', () => {
	// 			if (confirm('Are you sure you want to delete this color?')) {
	// 				clickedItem.remove();
	// 				deleteData(clickedItem.id);
	// 				modal.remove();
	// 			}
	// 		});
	// 	}
	// }

	function onClickItem(category) {
		console.log(category);
		showModal({
			originalCategory: category,
			categoryList: categoryList,
			isEdit: true,
		})
		// showModal({ clickedItem: event.currentTarget, isEdit: true });
	}

	function changeDisplay(isEmpty) {
		if (isEmpty) {
			serviceContainer.style.display = 'none';
			container.style.display = 'flex';
			emptyMessage.style.display = 'flex';
			return;
		} else {
			serviceContainer.style.display = 'grid';
			emptyMessage.style.display = 'none';
			container.style.display = ''; // Resets to the default CSS value
		}
  	}
</script>

<div class="options-header" id="options-header">
	<h1>텍스트박스 설정</h1>
</div>
<div class="container">
	<div class="category-header">
		카테고리 관리
		<div class="add" id="add" on:click={() => showModal({ isEdit: false })}>추가</div>
	</div>
	<div id="colorList" class="color-container" >
		{#each categoryList as category}
			<CategoryItem category={category} onClickItem={() => onClickItem(category)} changeDisplay={changeDisplay} />
		{/each}
	</div>
	<div class="empty-message" id="emptyMessage">
		<p>카테고리가 없습니다.</p>
	</div>
	<div id="modal"></div>
</div>