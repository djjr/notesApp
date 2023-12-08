let notes;
let easymde;

if (typeof getNotesFromDataJs !== 'undefined') {
    notes = getNotesFromDataJs();
} else {
    notes = JSON.parse(localStorage.getItem('notes')) || [];
}

function addNote(note) {
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

function displayNotes0() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteItem = document.createElement('div');
        
        const noteTitle = document.createElement('h2');
        noteTitle.textContent = note.title;
        
        const noteText = document.createElement('p');
        //noteText.textContent = note.text;
        noteText.innerHTML = note.text;

        noteItem.appendChild(noteTitle);
        noteItem.appendChild(noteText);
        
        notesList.appendChild(noteItem);
    });
}

function displayNotesOLD() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const noteElement = document.createElement('div');
        
        const noteHTML = marked.parse(note.text);
        const tagsHTML = note.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');
        
        noteElement.innerHTML = `<h2>${note.title}</h2><p>${noteHTML}</p><div>${tagsHTML}</div>`;
        notesList.appendChild(noteElement);
    }
}

function displayNotes(tags = []) {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    let notesToDisplay = notes;

    if (tags.length > 0) {
        notesToDisplay = notes.filter(note => 
            tags.every(tag => note.tags.includes(tag))
        );
    }

    for (let i = 0; i < notesToDisplay.length; i++) {
        const note = notesToDisplay[i];
        const noteElement = document.createElement('div');
        
        // Convert markdown text to HTML using marked
        const noteHTML = marked.parse(note.text);
        const tagsHTML = note.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');
        
        noteElement.innerHTML = `<h2>${note.title}</h2><p>${noteHTML}</p><div>${tagsHTML}</div>`;
        notesList.appendChild(noteElement);
    }
}


function downloadData() {
    const dataStr = "function getNotesFromDataJs() { return " + JSON.stringify(notes) + "; }";
    const blob = new Blob([dataStr], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('new-note-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('note-title').value;
    const text = easymde.value();
    const newTagsInput = document.getElementById('new-tags').value;
    let newTags = newTagsInput ? newTagsInput.split(',').map(tag => tag.trim()) : [];
    
    // logic to add selected existing tags to newTags array

    const note = { title, text, tags: newTags };
    
    addNote(note);
    displayExistingTags();
    buildTagSelectionInterface();
    e.target.reset();
});

function addNote(note) {
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

function displayExistingTags() {
    const existingTagsDiv = document.getElementById('existing-tags');
    existingTagsDiv.innerHTML = '';
    
    let allTags = getAllTags();
    
    allTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.textContent = tag;
        tagElement.classList.add('tag');
        
        tagElement.addEventListener('click', () => {
            addTagToNewNote(tag);
        });
        
        existingTagsDiv.appendChild(tagElement);
    });
}

function getAllTags() {
    let allTags = [];
    notes.forEach(note => {
        allTags = [...allTags, ...note.tags];
    });
    
    return [...new Set(allTags)];
}

function addTagToNewNote(tag) {
    const newTagsInput = document.getElementById('new-tags');
    newTagsInput.value += (newTagsInput.value ? ', ' : '') + tag;
}

function buildTagSelectionInterface() {
    const tagContainer = document.getElementById('tag-selection-container');
    const allTags = getAllTags();

    tagContainer.innerHTML = '';
    
    allTags.forEach(tag => {
        const tagCheckbox = document.createElement('input');
        tagCheckbox.type = 'checkbox';
        tagCheckbox.value = tag;
        tagCheckbox.id = `tag-${tag}`;
        tagCheckbox.addEventListener('change', updateDisplayedNotesBasedOnTags);

        const tagLabel = document.createElement('label');
        tagLabel.htmlFor = `tag-${tag}`;
        tagLabel.textContent = tag;

        tagContainer.appendChild(tagCheckbox);
        tagContainer.appendChild(tagLabel);
    });
}

function updateDisplayedNotesBasedOnTags() {
    const allTagCheckboxes = document.querySelectorAll('#tag-selection-container input[type="checkbox"]');
    const selectedTags = [];
    
    allTagCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedTags.push(checkbox.value);
        }
    });

    displayNotes(selectedTags);
}


document.addEventListener('DOMContentLoaded', () => {
    easymde = new EasyMDE({ element: document.getElementById("note-text") });
    buildTagSelectionInterface();
    displayNotes()
});
