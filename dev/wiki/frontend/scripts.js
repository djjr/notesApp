
  //import API_BASE_URL from './config';
  //create global identifier for the markdown object
  let easymde;

  let editingNoteId = null; // Global variable to track the editing note's ID

  // Function to load a note into the form for editing
  // function loadNoteForEditing(noteId) {
  //   fetch(`${API_BASE_URL}/notes/${noteId}`)
  //     .then(response => response.json())
  //     .then(note => {
  //       document.getElementById('title').value = note.title;
  //       console.log(`note.title = ${note.title}`);
  //       //document.getElementById('content').value = note.content;
  //       // Set content in EasyMDE editor
  //       if (easymde) {
  //           easymde.value(note.content);
  //       } else {
  //           console.error('EasyMDE editor instance is not available.');
  //       }

  //       // Extract tag IDs and join them into a comma-separated string
  //       const tagIds = note.tags.map(tag => tag._id).join(',');

  //       // Convert tag IDs to tag names
  //       if (tagIds) {
  //           console.log(`tagIds=${tagIds}`);
  //           fetch(`${API_BASE_URL}/tags/ids2names?tagIds=${tagIds}`)
  //               .then(response => response.json())
  //               .then(tagNames => {
  //                   //document.getElementById('tags').value = tagNames.join(', ');
  //                   document.getElementById('tags').value = tagNames;
  //               })
                
  //               .catch(error => console.error('Error:', error));
  //       } else {
  //           document.getElementById('tags').value = '';
  //       }

  //       editingNoteId = noteId; // Store the editing note's ID
  //     })
  //     .catch(error => console.error('Error fetching note for editing:', error));
  // }
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

  // create event listener for submit button (either adds or updates note)
  // document.getElementById('noteForm').addEventListener('submit', function(event) {
  //   event.preventDefault();

  //   const title = document.getElementById('title').value;
  //   const content = easymde.value();
  //   const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
  //   //console.log(tags);

  //   if (editingNoteId) {
  //     // Edit operation
  //     console.log(`editingNoteId = ${editingNoteId}`);
  //     fetch(`${API_BASE_URL}/notes/${editingNoteId}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ title, content, tags }),
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('Note updated:', data);
  //       editingNoteId = null; // Reset the editing note ID
  //     })
  //     .catch(error => console.error('Error:', error));
  //   } else {
  //     // Add operation
  //     fetch(`${API_BASE_URL}/notes`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ title, content: content, tags }),
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('Success:', data);
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  //   }
  // });

    const contextMenu = document.getElementById('custom-context-menu');

    contextMenu.addEventListener('mouseleave', () => {
    contextMenu.style.display = 'none';
    });

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
    // delete a note based on user click on delete button
    // function handleDeleteClick(noteDiv, noteId) {
    //     fetch(`${API_BASE_URL}/notes/${noteId}`, {
    //         method: 'DELETE',
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('DELETED', data);

    //             // Remove the noteDiv from the DOM
    //             //noteDiv.remove();
    //             noteDiv.innerHTML = 'ALL GONE';
    //         })
    //         .catch(error => console.error('Error:', error));
    // }
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

///////////////////////////////////////////////////////////////////
    function displayNotes(notes, allTags, elementID) {

        // Get the container to display notes
        const container = document.getElementById(elementID);
        container.innerHTML = ''; // Clear any existing notes


        // Loop through all notes and create HTML for each
        for (const note of notes) {
          // Create a div to hold each note
          const noteDiv = document.createElement('div');
          noteDiv.className = 'note';
          
          // Create and append elements for the title, content, and tags
          const title = document.createElement('h4');
          title.textContent = note.title;
          noteDiv.appendChild(title);
  
          const content = document.createElement('p');
          //content.textContent = note.content;

          // Convert markdown text to HTML using marked
          content.innerHTML = marked.parse(note.content ? note.content : "nothing found");

          const regex = /\[\[LIST\]\]/;
          if (regex.test(content.innerHTML)) {
              // Split the content into before and after [[LIST]]
              const parts = content.innerHTML.split(regex);
              let beforeList = parts[0];
              const afterList = parts[1] || ""; // Handle case where there's nothing after [[LIST]]

              // Append the <h3> element to the part before [[LIST]]
              beforeList += `<h3>LIST of All Notes with tags=${note.tags.map(tag => tag.name).join(",")}</h3>`;

              // Perform the fetch operation
              fetch(`${API_BASE_URL}/tags/names2ids?tagArray=${note.tags.map(tag => tag.name).join(",")}`)
                  .then(response => response.json())
                  .then(tagIds => {
                      fetch(`${API_BASE_URL}/notes?tagIds=${tagIds.join(",")}`)
                          .then(response => response.json())
                          .then(notes => {
                              beforeList += "<OL>";
                              for (const note of notes) {
                                  if (!regex.test(note.content)) {
                                      beforeList += `<LI><a href="onenote.html?noteId=${note._id}">${note.title}</a></LI>`;
                                  }
                              }
                              beforeList += "</OL><br /><br />";
                              // Finally, recombine the parts and update content.innerHTML
                              content.innerHTML = beforeList + afterList;
                          })
                          .catch(error => console.error('Error fetching notes:', error));
                  })
                  .catch(error => console.error('Error fetching tag IDs:', error));
          }



          noteDiv.appendChild(content);
  
          const tags = document.createElement('p');
          tags.className = 'existing-tag';          
            tags.textContent = 'Tags: ';
                note.tags.forEach((tag, index, arr) => {
                const tagSpan = document.createElement('span');

                tagSpan.textContent = tag.name;
                tagSpan.setAttribute('data-note-id', note._id);
                tagSpan.setAttribute('data-tag-id', tag._id);
                tagSpan.id = `note-${note._id}-tag-${tag._id}`; // Setting a unique ID



                tagSpan.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const contextMenu = document.getElementById('custom-context-menu');

                    // Set the text content dynamically to include the tag name
                    contextMenu.querySelector('#show-notes').textContent = `Show all notes tagged ${tag.name}`;
                    contextMenu.querySelector('#show-videos').textContent = `Show all videos tagged ${tag.name}`;
                    contextMenu.querySelector('#remove-tag').textContent = `Remove tag: ${tag.name}`;

                    //contextMenu.style.top = `${e.clientY}px`;
                    //contextMenu.style.left = `${e.clientX}px`;
                    contextMenu.style.top = `${e.pageY}px`;
                    contextMenu.style.left = `${e.pageX}px`;
                    contextMenu.style.display = 'block';

                    // Inside the context menu event listener
                    contextMenu.querySelector('#show-notes').onclick = () => {
                        fetch(`${API_BASE_URL}/notes?tagIds=${tag._id}`) // Sending tag ID as query parameter
                            .then(response => response.json())
                            .then(data => {
                            // Do something with the data (display the notes in the frontend)
                            // For example:
                            displayNotes(data, allTags, elementID);  // Assuming displayNotes is a function that takes a list of notes and displays them
                            })
                            .catch(error => console.error('Error:', error));
                    };
                    
                    contextMenu.querySelector('#show-videos').onclick = () => alert(`Show videos with tag: ${tag.name}`);

                    contextMenu.querySelector('#remove-tag').onclick = () => {
                        fetch(`${API_BASE_URL}/notes/${note._id}/tags/${tag._id}`, {
                            method: 'DELETE',
                        })
                            .then(response => response.json())
                            .then(data => {
                            // On success, remove the tag from the display
                            removeTagFromDisplay(note._id, tag._id);
                            })
                            .catch(error => console.error('Error:', error));
                        };

                });
            tags.appendChild(tagSpan);
            
            if (index  < arr.length - 1) {
                tags.appendChild(document.createTextNode(', '));
            }
          });
          noteDiv.appendChild(tags);

          const allTagsElement = document.createElement('p');
          allTagsElement.textContent = 'Click to add a tag: ';
          allTags.map(tag => createTagElement(tag, note._id)).forEach(tagElement => allTagsElement.appendChild(tagElement));
          noteDiv.appendChild(allTagsElement);


          //Put buttons for note maintenance here
          //createEditButton(noteId);
          //createDeleteButton(noteDiv, noteId);

            // Create the edit button
            const editButton = document.createElement('button');
            editButton.textContent = "Edit this note";
            editButton.addEventListener('click', () => {
              //alert(`Editing note ${note._id}`);
              loadNoteForEditing(note._id);
            });

            // Create the delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete this note";
            deleteButton.addEventListener('click', () => handleDeleteClick(noteDiv, note._id), false);

            // Append the buttons to the noteDiv
            noteDiv.appendChild(editButton);
            noteDiv.appendChild(deleteButton);

  
          // Append the note div to the container
          container.appendChild(noteDiv);
        }
    }
///////////////////////////////////////////////////////////////
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

    document.addEventListener('DOMContentLoaded', () => {
    easymde = new EasyMDE({ element: document.getElementById("content") });
    //buildTagSelectionInterface();
    //displayNotes()
});
