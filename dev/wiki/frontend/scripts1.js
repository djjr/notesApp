
    //import API_BASE_URL from './config';
    //create global identifier for the markdown object
    let easymde;

    let editingNoteId = null; // Global variable to track the editing note's ID

    document.addEventListener('DOMContentLoaded', () => {
        easymde = new EasyMDE({ element: document.getElementById("content") });
        });

    const contextMenu = document.getElementById('custom-context-menu');
    contextMenu.addEventListener('mouseleave', () => {
        contextMenu.style.display = 'none';
        });

    async function loadNoteForEditing(noteId) {
        try {
            const noteResponse = await fetch(`${API_BASE_URL}/notes/${noteId}`);
            const note = await noteResponse.json();
            
            document.getElementById('title').value = note.title;
            if (easymde) {
                easymde.value(note.content);
            } else {
                console.error('EasyMDE editor instance is not available.');
            }

            // Extract tag IDs and join them into a comma-separated string
            const tagIds = note.tags.map(tag => tag._id).join(',');

            if (tagIds) {
                const tagNamesResponse = await fetch(`${API_BASE_URL}/tags/ids2names?tagIds=${tagIds}`);
                const tagNames = await tagNamesResponse.json();
                document.getElementById('tags').value = tagNames;
            } else {
                document.getElementById('tags').value = '';
            }

            editingNoteId = noteId; // Store the editing note's ID
        } catch (error) {
            console.error('Error fetching note for editing:', error);
        }
    }



    function createTagElement(tag, noteId) {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag.name;
        tagElement.addEventListener('click', () => addTagToNote(noteId, tag._id));
        return tagElement;
        }

    async function addTagToNote(noteId, tagId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notes/${noteId}/tags/${tagId}`, {
            method: 'POST'
            });
            const message = await response.text();
            console.log(message);
            if(response.ok) {
            showAllNotes(); // Refresh the list of notes to show the updated tags
            }
        } catch (error) {
            console.error('Error adding tag to note:', error);
        }
    }

    function removeTagFromDisplay(noteId, tagId) {
        const tagElement = document.querySelector(`#note-${noteId}-tag-${tagId}`);
        if (tagElement) {
            tagElement.remove();
        }
    }

    async function handleDeleteClick(noteDiv, noteId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
                method: 'DELETE',
            });
    
            const data = await response.json();
            console.log('DELETED', data);
    
            // Remove the noteDiv from the DOM
            // You can use either remove() or setting innerHTML to 'ALL GONE'
            //noteDiv.remove();
            noteDiv.innerHTML = 'ALL GONE';
        } catch (error) {
            console.error('Error:', error);
        }
    }
    // Display a collection of notes in an element on the page
    function displayNotes(notes, tags, elementID) {
        
        const container = document.getElementById(elementID); // grab element
        container.innerHTML = '';                             // clear content

        notes.forEach(note => {                               // append notes
            container.appendChild(createNoteDiv(note, tags));
        });
    }

    function createNoteDiv(note, tagArray) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.appendChild(createTitleElement(note));
        noteDiv.appendChild(processNoteContent(note));
        noteDiv.appendChild(createTagElements(note));
        noteDiv.appendChild(createClickToAddTagElement(note, tagArray));
        noteDiv.appendChild(createNoteButtons(note));
        return noteDiv;
    }

    function createTitleElement(note) {
        const title = document.createElement('h4');
        title.textContent = note.title;
        return title;
    }

    function processNoteContent(note) {
        const content = document.createElement('p');
        content.innerHTML = marked.parse(note.content ? note.content : "nothing found");
        handleListReplacement(content, note.tags);
        return content;
    }

    // custom markdown [[LIST]] generates links to all notes with same tags as this note    
    async function handleListReplacement(contentElement, tags) {
        const regex = /\[\[LIST\]\]/;
        if (regex.test(contentElement.innerHTML)) {
            const parts = contentElement.innerHTML.split(regex);
            const beforeList = parts[0];
            const afterList = parts[1] || "";
    
            // create <OL> of linked titles for notes with same tags
            const listContent = await fetchAndProcessTags(tags);
            // substitute for the [[LIST]] in the markdown
            contentElement.innerHTML = beforeList + listContent + afterList;
        }
    }

    async function fetchAndProcessTags(tags) {
        // Implement fetching and processing logic for tags
        // Return the HTML content to be inserted

        try {
            const tagNames = tags.map(tag => tag.name).join(",");
            const tagIdsResponse = await fetch(`${API_BASE_URL}/tags/names2ids?tagArray=${tagNames}`);
            const tagIds = await tagIdsResponse.json();
            
            const notesResponse = await fetch(`${API_BASE_URL}/notes?tagIds=${tagIds.join(",")}`);
            const notes = await notesResponse.json();
    
            let listContent = "<OL>";
            for (const note of notes) {
                if (!/\[\[LIST\]\]/.test(note.content)) {
                    listContent += `<LI><a href="onenote.html?noteId=${note._id}">${note.title}</a></LI>`;
                }
            }
            listContent += "</OL><br /><br />";
    
            return listContent;
        } catch (error) {
            console.error('Error:', error);
            return ''; // Return an empty string in case of an error
        }
    }

    // tags have right click context menu
    function createTagElements(note) {
        const tagsElement = document.createElement('p');
        tagsElement.className = 'existing-tag';
        tagsElement.textContent = 'Click tag to see related notes: ';
        // for each tag a hidden context menu is created
        note.tags.forEach((tag, index, arr) => {
            const tagSpan = createTagSpan(tag, note._id);
            tagsElement.appendChild(tagSpan);
            if (index < arr.length - 1) {
                tagsElement.appendChild(document.createTextNode(', '));
            }
        });
        return tagsElement;
    }
    

    function createTagSpan(tag, noteId) {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = tag.name;
        tagSpan.setAttribute('data-note-id', noteId);
        tagSpan.setAttribute('data-tag-id', tag._id);
        tagSpan.id = `note-${noteId}-tag-${tag._id}`;
        tagSpan.addEventListener('contextmenu', tagContextMenuHandler);
        return tagSpan;
    }
    
    function tagContextMenuHandler(event) {
        event.preventDefault();
        const tagSpan = event.target;
        const tagId = tagSpan.getAttribute('data-tag-id');
        const tagName = tagSpan.textContent;
        const noteId = tagSpan.getAttribute('data-note-id');
    
        const contextMenu = document.getElementById('custom-context-menu');
    
        // Set the text content dynamically to include the tag name
        contextMenu.querySelector('#show-notes').textContent = `Show all notes tagged ${tagName}`;
        contextMenu.querySelector('#show-videos').textContent = `Show all videos tagged ${tagName}`;
        contextMenu.querySelector('#remove-tag').textContent = `Remove tag: ${tagName}`;
    
        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.display = 'block';
    
        // Set up onclick events for the context menu items
        contextMenu.querySelector('#show-notes').onclick = () => fetchAndDisplayNotesByTag(tagId);
        contextMenu.querySelector('#show-videos').onclick = () => alert(`Show videos with tag: ${tagName}`);
        contextMenu.querySelector('#remove-tag').onclick = () => removeTagFromNote(noteId, tagId);
    }

    function createTagElement(tag, noteId) {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag.name;
        tagElement.addEventListener('click', () => addTagToNote(noteId, tag._id));
        return tagElement;
    }

    function createClickToAddTagElement(note, tagArray) {
        const allTagsElement = document.createElement('p');
        allTagsElement.textContent = 'Click to add a tag: ';
            tagArray.map(tag => createTagElement(tag, note._id)).forEach(tagElement => allTagsElement.appendChild(tagElement));
            return allTagsElement;     
    }

    
    function fetchAndDisplayNotesByTag(tagId) {
        fetch(`${API_BASE_URL}/notes?tagIds=${tagId}`)
            .then(response => response.json())
            .then(data => {
                //displayNotes(data, allTags, 'notesContainer');
                displayNotes(data, [{'_id': tagId, 'name': ''}], 'notesContainer');
            })
            .catch(error => console.error('Error:', error));
    }
    
    function removeTagFromNote(noteId, tagId) {
        fetch(`${API_BASE_URL}/notes/${noteId}/tags/${tagId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                removeTagFromDisplay(noteId, tagId);
            })
            .catch(error => console.error('Error:', error));
    }
    
    function createNoteButtons(note) {
        const buttonContainer = document.createElement('div');
        const editButton = createEditButton(note._id);
        const deleteButton = createDeleteButton(note);
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        return buttonContainer;
    }
    
    function createEditButton(noteId) {
        const editButton = document.createElement('button');
        editButton.textContent = "Edit this note";
        editButton.addEventListener('click', () => loadNoteForEditing(noteId));
        return editButton;
    }
    
    function createDeleteButton(note) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete this note";
        deleteButton.addEventListener('click', () => handleDeleteClick(noteDiv, note._id), false);
        return deleteButton;
    }    

    async function getAllTags() {
        try {
            // Make a GET request to fetch all tags
            const tagResponse = await fetch(`${API_BASE_URL}/tags`); 
            const allTags = await tagResponse.json();
            return allTags;            

      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    }

    async function showAllNotes() {
      try {
        // Make a GET request to fetch all notes
        const response = await fetch(`${API_BASE_URL}/notes`);
        const notes = await response.json();

        // Make a GET request to fetch all tags
        //const tagResponse = await fetch(`${API_BASE_URL}/tags`); 
        //const allTags = await tagResponse.json();
        const allTags = await getAllTags(); 
        //console.log(allTags)           

        displayNotes(notes, allTags, 'notesContainer');

      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }


