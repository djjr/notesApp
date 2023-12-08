window.onload = function() {

    // Shuffle the array
    //taglines.sort(() => Math.random() - 0.5);

    // Join the taglines into a string with the separator
    //var taglinesString = taglines.join("  \u25CF  ");

    // Insert the string into the paragraph
    //document.getElementById('taglines').innerText = taglinesString;

    const container = document.getElementById('card-container');
    data.sort(() => Math.random() - 0.5); // shuffle the data

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';

        const image = document.createElement('img');
        image.className = 'card-image';
        image.src = `./images/${item.image}`;

        const titleFront = document.createElement('h3');
        titleFront.className = 'card-title';
        titleFront.innerText = item.title;

        const titleBack = document.createElement('h3');
        titleBack.className = 'card-title';
        titleBack.innerText = item.title;

        const description = document.createElement('p');
        description.className = 'card-description';
        description.innerHTML = item.description;

        cardFront.appendChild(image);
        cardFront.appendChild(titleFront);
        cardBack.appendChild(titleBack);
        cardBack.appendChild(description);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        // Add URL to card back
        if (item.url) {
            cardBack.addEventListener('click', function() {
                document.getElementById('iframe').src = item.url;
                document.getElementById('iframe-container').style.display = 'block';
            });
        }

        container.appendChild(card);

        // Close button functionality
        document.getElementById('close-iframe').addEventListener('click', function() {
            document.getElementById('iframe-container').style.display = 'none';
        });        
    });
}
