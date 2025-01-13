<script>
	import { getAllCategoryData } from '../options/js/database.js';
	import { onMount } from 'svelte';
	import { getAllData, deleteAllData } from '../background/database.js';
    import DataCard from './component/card/datacard.svelte';


	let categories;
	let entries = [];

	let resultList;
	let emptyMessage;
	let deleteAllBtn;

	onMount(async () => {
		resultList = document.getElementById("resultList");
		emptyMessage = document.getElementById("emptyMessage");
		deleteAllBtn = document.getElementById("deleteAllBtn");

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
	function showEmptyMessage() {
		emptyMessage.style.display = "flex";
		resultList.style.display = "none";
	}

	const updateDeleteAllBtnVisibility = (hasData) => {
  		deleteAllBtn.style.display = hasData ? "block" : "none";
	};

	function onRefresh() {
		updateDeleteAllBtnVisibility(false);
		showEmptyMessage();
	}

</script>

<body>
	<div style="height: 600px; width: 375px;">
		<div class="header" id="header">
			<h1>텍스트 박스</h1>
			<button id="deleteAllBtn" on:click={deleteAllDataFromList}>전체 삭제</button>
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
			<p>저장된 글이 없습니다</p>
		  </div>
		  <div id="bottom-sheet"></div>
		  <!-- Load script at the end of the body -->
		  <script src="index.js" type="module"></script>
	</div>
</body>