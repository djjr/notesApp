document.addEventListener('DOMContentLoaded', function () {
    const images = ["books01.png", "books02.png", "books03.png", "books04.png", "books05.png", "books06.png", "books07.png", "books08.png", "books09.png"];
    let currentImageIndex = -1;

    const imageContainer = document.getElementById('random-image');
    const closeButton = document.getElementById('close-button');

    function getRandomImage() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * images.length);
        } while (randomIndex === currentImageIndex);
        currentImageIndex = randomIndex;
        return images[randomIndex];
    }

    function displayRandomImage() {
        imageContainer.style.opacity = 0;
        setTimeout(() => {
            imageContainer.src = getRandomImage();
            imageContainer.style.opacity = 1;
        }, 1000);
    }

    // Initial image display
    displayRandomImage();

    // Event listeners
    imageContainer.addEventListener('click', displayRandomImage);
    

    // Ensure image is loaded before displaying
    imageContainer.addEventListener('load', () => {
        imageContainer.style.opacity = 1;
    });
});
