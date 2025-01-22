<script>
	import { getAllCategoryData } from '../database/categoryDB.js';
	import { onMount } from 'svelte';
	import { getAllData, deleteAllData, getDataByCategories } from '../database/bookmarkDB.js';
	import { openBottomSheet } from '../service/common.js';
    import DataCard from './component/card/datacard.svelte';
	import CategorySelectSheet from './component/bottomsheet/categorySelectSheet.svelte';

	let categories;
	let filterCategories = [];

	let entries = [];

	let resultList;
	let emptyMessage;
	let headerButtons;

	onMount(async () => {
		resultList = document.getElementById("resultList");
		emptyMessage = document.getElementById("emptyMessage");
		headerButtons = document.getElementById("header-buttons");

		const data = await getAllData() ?? [];
		categories = await getAllCategoryData();
		entries = data;
		checkEntries();
	});

	async function deleteAllDataFromList() {
		try {
			await deleteAllData();

			// Add transition to the entire resultList
			resultList.style.transition = "opacity 0.3s ease";
			resultList.style.opacity = "0";

			setTimeout(() => {
				resultList.innerHTML = "";
				showEmptyMessage();
				updateDeleteAllBtnVisibility(false);
				resultList.style.opacity = "1";
			}, 300);

		} catch (error) {
			console.error("Error deleting all entries:", error);
		}
	}

	function checkEntries() {
		if(entries.length === 0) {
			const message = filterCategories.length > 0 ? "선택하신 카테고리에 해당되는\n글이 없습니다" : "저장된 글이 없습니다";
			showEmptyMessage(message);
		} else {
			updateDeleteAllBtnVisibility(true);
		}
	}

	function showEmptyMessage(message) {
		const messageElement = emptyMessage.querySelector("p");
		messageElement.textContent = message;
		
		emptyMessage.style.display = "flex";
		resultList.style.display = "none";
	}

	const updateDeleteAllBtnVisibility = (hasData) => {
  		headerButtons.style.display = hasData ? "flex" : "none";
	};

	function onRefresh() {
		updateDeleteAllBtnVisibility(false);
		showEmptyMessage();
	}

	function onTapFilterBtn() {
		openBottomSheet(CategorySelectSheet, {
			onFilterSelect: onFilterSelect,
			selectedCategories: filterCategories,
		},
		"필터 설정"
		);
	}
	async function onFilterSelect(selectedCategories) {
		console.error(selectedCategories);
		console.error(filterCategories);
		console.error(selectedCategories === filterCategories);
		if(selectedCategories === filterCategories) return;

		filterCategories = selectedCategories;
		let data = [];
		if(filterCategories.length === 0) {
			data = await getAllData();
		}else{
			data = await getDataByCategories(selectedCategories);
		}
		console.error(data);
		entries = data ?? [];
		checkEntries();
	}
</script>

<style>
	#header-buttons {
		display: flex;
		flex-direction: row;
		gap: 8px;
	}

	#deleteAllBtn, #filterBtn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: 5px;
		width: 24px;
		height: 24px;
	}
	
	#deleteAllBtn:hover, #filterBtn:hover{
		background-color: #f0f0f0;
	}

	#deleteAllBtn .img, #filterBtn .img{
		width: 20px;
		height: 20px;
	}

</style>
<body>
	<div style="height: 600px; width: 375px;">
		<div class="header" id="header">
			<h1>텍스트 박스</h1>
			<div id="header-buttons">
				<button id="filterBtn" on:click={onTapFilterBtn}>
					<img src="../assets/images/filter.svg" alt="filter" class="img">
				</button>
				<button id="deleteAllBtn" on:click={deleteAllDataFromList}>
					<img src="../assets/images/trash.svg" alt="delete" class="img">
				</button>
			</div>
		  </div>
		  <ul id="resultList">
			{#each entries as entry}
				<DataCard 
					id={entry.id}
					entry={entry}
					category={categories.find(category => `${category.categorySeq}`=== entry.category)}
					onRefresh={onRefresh}
				/>
			{/each}
		  </ul>
		  <div class="empty-message" id="emptyMessage">
			<p></p>
		  </div>
		  <div id="bottom-sheet"></div>
		  <!-- Load script at the end of the body -->
		  <script src="index.js" type="module"></script>
	</div>
</body>