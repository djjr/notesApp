// Main functionality: open a note editor
  document.getElementById('noteForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = easymde.value();
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    try {
        let response, data;
        if (editingNoteId) {
            // Edit operation
            response = await fetch(`${API_BASE_URL}/notes/${editingNoteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, tags }),
            });
            data = await response.json();
            console.log('Note updated:', data);
            editingNoteId = null; // Reset the editing note ID
        } else {
            // Add operation
            response = await fetch(`${API_BASE_URL}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, tags }),
            });
            data = await response.json();
            console.log('Success:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

//Event handler for reset button (needs to be explicit because of EasyMDE use)
document.getElementById('resetButton').addEventListener('click', (event) => {
    // Prevent the default form reset behavior to handle it manually
    event.preventDefault();

    // Reset the title and tags fields
    document.getElementById('title').value = '';
    document.getElementById('tags').value = '';

    // Reset the EasyMDE editor's content
    if (easymde) {
        easymde.value('');
    }

    // Reset any other dynamic content or states as necessary
    editingNoteId = null;

});