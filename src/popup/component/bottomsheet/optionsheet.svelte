<script>
    import {hideBottomSheet} from '../../../service/common.js';
    export let onDelete = () => {};
    export let onEdit = () => {};
    function handleDelete() {
        hideBottomSheet();
        setTimeout(() => {
            onDelete();
        }, 300);
    }

    function handleEdit() {
        hideBottomSheet();
        setTimeout(() => {
            onEdit();
        }, 300);
    }
    function handleKeydown(event) {
        if (event.key === 'Escape') {
            visible = false;
            onClose();
        }
    }

</script>

<div class="bottom-sheet" 
    on:click|stopPropagation 
    role="button" 
    aria-label="옵션" 
    on:keydown={handleKeydown}
    tabindex="0"
>
    <div class="options">
      <button class="option-item" on:click={handleEdit}>
        <div class="icon">✏️</div>
        <span>카테고리 변경하기</span>
      </button>

      <button class="option-item" on:click={handleDelete}>
        <div class="icon">🗑️</div>
        <span>문구 삭제하기</span>
      </button>
    </div>
  </div>

<style>
  .bottom-sheet {
    background: white;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .option-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: 'GmarketSansMedium', sans-serif;
  }

  .option-item:hover {
    background: #f5f5f5;
  }

  .icon {
    font-size: 24px;
  }

  span {
    font-size: 16px;
  }
</style>
