<script>
	import { getAllCategoryData } from '../options/js/database.js';
	import { onMount } from 'svelte';
	import { getAllData, deleteData, deleteAllData } from '../background/database.js';
    import Modal from './modal.svelte';

	let categories;
	let entries = [];
	async function deleteAllDataFromList() {
		try {
			await deleteAllData();
			const resultList = document.getElementById("resultList");

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
	function showEmptyMessage() {
		const resultList = document.getElementById("resultList");
		const emptyMessage = document.getElementById("emptyMessage");
		emptyMessage.textContent = "저장된 글이 없습니다";
		emptyMessage.style.display = "flex";
		resultList.style.display = "none";
	}

	const updateDeleteAllBtnVisibility = (hasData) => {
  		const deleteAllBtn = document.getElementById("deleteAllBtn");
  		deleteAllBtn.style.display = hasData ? "block" : "none";
	};
	
	onMount(async () => {

		document.getElementById("deleteAllBtn").addEventListener("click", deleteAllDataFromList);
		const data = await getAllData();
		categories = await getAllCategoryData();
		let hasData = data && data.length > 0;
		if (hasData) {
			updateDeleteAllBtnVisibility(true);
			entries = data;
		} else {
			updateDeleteAllBtnVisibility(false);
			showEmptyMessage();
		}
		var categorys = getAllCategoryData();
		console.log(categorys);
	});

	function onRefresh() {
		updateDeleteAllBtnVisibility(false);
		showEmptyMessage();
	}
</script>

<body>
	<div style="height: 600px; width: 375px;">
		<div class="header" id="header">
			<h1>텍스트 박스</h1>
			<button id="deleteAllBtn">전체 삭제</button>
		  </div>
		  <ul id="resultList">
			{#each entries as entry}
				<Modal 
					id={entry.id}
					entry={entry}
					category={categories.find(category => category.id === entry.categoryId)}
					onRefresh={onRefresh}
				/>
			{/each}
		  </ul>
		  <div class="empty-message" id="emptyMessage"></div> 
		 
		  <!-- Load script at the end of the body -->
		  <script src="index.js" type="module"></script>
	</div>
</body>