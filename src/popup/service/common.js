import { SvelteComponent } from 'svelte';

import BasicBottomSheet from '../component/bottomsheet/basicbottomsheet.svelte';

let bottomSheetInstance = null;

export function create(Component, target, props = {}) {
    // Ensure the target exists
    if (!target) {
        throw new Error('Target element is required to mount the component.');
    }

    // Instantiate and mount the component
    return new Component({
        target: target,
        props: props
    });
}

export function openBottomSheet(Component, props = {}, title = '') {
    let bottomSheet = document.querySelector('#bottom-sheet');

    if (!bottomSheet) {
        bottomSheet = document.createElement('div');
        bottomSheet.id = 'bottom-sheet';
        document.body.appendChild(bottomSheet);
    }

    // Create the BasicBottomSheet instance
    bottomSheetInstance = new BasicBottomSheet({
        target: bottomSheet,
        props: {
            visible: false, // Start invisible
            title: title,
            onClose: () => {
                hideBottomSheet();
            }
        }
    });

    // Delay the visibility change for animation
    setTimeout(() => {
        bottomSheetInstance.$set({ visible: true });

        // Dynamically mount the provided Component inside the BottomSheet content area
        const contentTarget = bottomSheet.querySelector('#content');
        if (contentTarget) {
            new Component({
                target: contentTarget,
                props: props
            });
        } else {
            console.error("Content target element with ID 'content' not found inside bottom-sheet.");
        }
    }, 0); // No delay needed for visibility change

    return {
        bottomSheetInstance,
    };
}

export function hideBottomSheet() {
    if (bottomSheetInstance) {
        bottomSheetInstance.$set({ visible: false }); // Set visibility to false for animation

        // Clean up after the animation duration (match transition duration in CSS)
        setTimeout(() => {
            const container = document.querySelector('#bottom-sheet');
            if (container) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                bottomSheetInstance = null; // Reset the instance reference
            }
        }, 300); // Match animation duration
    }
}