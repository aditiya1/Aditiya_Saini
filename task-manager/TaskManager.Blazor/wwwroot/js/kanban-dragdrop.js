(function () {
    let dotNetRef = null;

    function handleDragStart(e) {
        const card = e.target.closest('.kanban-card');
        if (!card) return;
        const taskId = card.getAttribute('data-task-id');
        if (taskId) {
            e.dataTransfer.setData('text/plain', taskId);
            e.dataTransfer.effectAllowed = 'move';
            card.classList.add('dragging');
        }
    }

    function handleDragOver(e) {
        const column = e.target.closest('.kanban-column');
        if (!column) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    async function handleDrop(e) {
        const column = e.target.closest('.kanban-column');
        if (!column || !dotNetRef) return;
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const targetStatus = parseInt(column.getAttribute('data-status'), 10);
        if (isNaN(taskId) || isNaN(targetStatus)) return;
        try {
            await dotNetRef.invokeMethodAsync('OnTaskDropped', taskId, targetStatus);
        } catch (err) {
            console.error('Drop failed:', err);
        }
    }

    function handleDragEnd(e) {
        const card = e.target.closest('.kanban-card');
        if (card) card.classList.remove('dragging');
    }

    window.initKanbanDragDrop = function (ref) {
        dotNetRef = ref;
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('drop', handleDrop);
        document.addEventListener('dragend', handleDragEnd);
    };

    window.disposeKanbanDragDrop = function () {
        document.removeEventListener('dragstart', handleDragStart);
        document.removeEventListener('dragover', handleDragOver);
        document.removeEventListener('drop', handleDrop);
        document.removeEventListener('dragend', handleDragEnd);
        dotNetRef = null;
    };
})();
