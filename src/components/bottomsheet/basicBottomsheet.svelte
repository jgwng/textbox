<script>
    import { slide } from 'svelte/transition';
    import '../../styles/bottomSheet.css';
    export let visible = false;
    export let onClose;
    export let title = '';

    function handleBackgroundClick(event) {
        if (event.target === event.currentTarget) {
            visible = false;
            onClose();
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            visible = false;
            onClose();
        }
    }
</script>

<div 
    class="overlay" 
    class:active={visible} 
    on:click={handleBackgroundClick}
    on:keydown={handleKeydown}
    tabindex="0"
    role="button"
    aria-label="닫기"
></div>

<div class="popup-container" transition:slide={{ duration: 300 }} class:open={visible} id="bottom-sheet-container">

    <div class="bottom-sheet-header">
        <span class="bottom-sheet-header-title">{title}</span>
    </div>

    <div class="content" id="content">
        <slot></slot>
    </div>
</div>
