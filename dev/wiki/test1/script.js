

let selectedTags = [];

function populateTags() {
    let tagPanel = document.getElementById('tag-panel');
    let uniqueTags = [...new Set(data.flatMap(item => item.tags))];
    uniqueTags.forEach(tag => {
        let div = document.createElement('div');
        div.classList.add('tag');
        div.textContent = tag;
        div.addEventListener('click', function() {
            this.classList.toggle('selected');
            if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
            } else {
                selectedTags.push(tag);
            }
            populateCards();
        });
        tagPanel.appendChild(div);
    });
}

function populateCards() {
    let cardPanel = document.getElementById('card-panel');
    cardPanel.innerHTML = '';
    let filteredData = selectedTags.length > 0 ? data.filter(item => selectedTags.every(tag => item.tags.includes(tag))) : data;
    filteredData.forEach(item => {
        let div = document.createElement('div');
        div.classList.add('card');

        if (item.url && item.url.trim() !== "") {
            let pdfUrl = item.url.endsWith('.pdf') ? `${item.url}#zoom=100` : item.url;
            div.innerHTML = `<h2>${item.title}</h2><iframe src="${pdfUrl}" class="card-content"></iframe>`;
                } else {
            div.innerHTML = `<h2>${item.title}</h2><div class="card-content">${item.content}</div>`;
        }

        div.addEventListener('click', function() {
            let expandedCard = document.querySelector('.card.expanded');
            if (expandedCard && expandedCard !== this) {
                expandedCard.classList.remove('expanded');
            }
            this.classList.toggle('expanded');
            if (this.classList.contains('expanded')) {
                this.scrollIntoView({behavior: "smooth", block: "center"});
            }
        });
        cardPanel.appendChild(div);
    });
}


// Shuffle the array
//taglines.sort(() => Math.random() - 0.5);

// Join the taglines into a string with the separator
//var taglinesString = taglines.join("  \u25CF  ");

// Insert the string into the paragraph
//document.getElementById('taglines').innerText = taglinesString;

populateTags();
populateCards();
