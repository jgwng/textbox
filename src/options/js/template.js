export function createModalHTML({ title = '', color = '', isEdit = true } = {}) {
    return `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h2>${isEdit ? 'Edit' : 'Add'} Color</h2>
                     <div class="close-icon" id="modal-close">
                        <img src="assets/images/close.svg" alt="Delete Icon">
                    </div>
                </div>
                <div class="modal-body">
                    <div class="input-group">
                        <input type="text" placeholder="Enter color name..." value="${title}">
                    </div>
                    <div class="color-palette">
                        <div class="color-option ${color === 'red' ? 'selected' : ''}" 
                            style="background-color: var(--pastel-red)" data-color="red"></div>
                        <div class="color-option ${color === 'orange' ? 'selected' : ''}" 
                            style="background-color: var(--pastel-orange)" data-color="orange"></div>
                        <div class="color-option ${color === 'yellow' ? 'selected' : ''}" 
                            style="background-color: var(--pastel-yellow)" data-color="yellow"></div>
                        <div class="color-option ${color === 'green' ? 'selected' : ''}" 
                            style="background-color: var(--pastel-green)" data-color="green"></div>
                        <div class="color-option ${color === 'blue' ? 'selected' : ''}" 
                            style="background-color: var(--pastel-blue)" data-color="blue"></div>
                        <div class="color-option ${color === 'purple' ? 'selected' : ''}" 
                            style="background-color: var(--pastel-purple)" data-color="purple"></div>
                        <div class="color-option ${color === 'pink' ? 'selected' : ''}" 
                            style="background-color: var(--pastel-pink)" data-color="pink"></div>
                        <div class="color-option ${color === 'teal' ? 'selected' : ''}" 
                            style="background-color: var(--pastel-teal)" data-color="teal"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    ${isEdit ? '<button class="delete-button">Delete</button>' : ''}
                    <button class="confirm-button">${isEdit ? 'Update' : 'Add'}</button>
                </div>
            </div>
        </div>
    `;
} 

export const createCardHTML = ({ title = ''} = {}) => {
    return `
       <div class="text-content">
                <p class="title">${title}</p>
            </div>
            <div class="close-icon" id="close">
                <img src="assets/images/close.svg" alt="Delete Icon">
        </div>
    `;
} 