document.addEventListener('DOMContentLoaded', function() {
    const overlays = document.querySelectorAll('.overlay');

    overlays.forEach((overlay) => {
        overlay.addEventListener('click', function() {
            const card = overlay.parentElement;
            swapWithFront(card);
        });
    });
});

function swapWithFront(selectedCard) {
    const frontCard = getFrontCard();

    if (selectedCard === frontCard) {
        return; // No need to swap if the front card is selected
    }

    // Swap data-card attributes
    const tempDataCard = selectedCard.getAttribute('data-card');
    selectedCard.setAttribute('data-card', frontCard.getAttribute('data-card'));
    frontCard.setAttribute('data-card', tempDataCard);
}

function getFrontCard() {
    const cards = document.querySelectorAll('.card');
    let frontCard;
    let maxZIndex = -1;

    cards.forEach((card) => {
        const zIndex = parseInt(getComputedStyle(card).zIndex, 10);
        if (zIndex > maxZIndex) {
            maxZIndex = zIndex;
            frontCard = card;
        }
    });

    return frontCard;
}
