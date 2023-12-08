document.getElementById('newDeckForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const URL = document.getElementById('URL').value;
    const year = document.getElementById('Year').value;
    const platform = document.querySelector('input[name="platform"]:checked').value;

    const tags = document.getElementById('tags').value.split(',');

    const data = { title, URL, year, platform, tags };

    fetch(`${API_BASE_URL}/decks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
