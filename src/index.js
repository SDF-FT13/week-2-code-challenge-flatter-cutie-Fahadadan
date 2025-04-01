// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const characterBar = document.getElementById('character-bar');
    const detailedInfo = document.getElementById('detailed-info');
    const votesForm = document.getElementById('votes-form');
    let currentCharacter = null;

    // Fetch and display all characters
    fetch('http://localhost:3000/characters')
        .then(response => response.json())
        .then(characters => {
            characters.forEach(character => {
                const span = document.createElement('span');
                span.textContent = character.name;
                span.addEventListener('click', () => displayCharacterDetails(character));
                characterBar.appendChild(span);
            });
        });

    // Display character details when clicked
    function displayCharacterDetails(character) {
        currentCharacter = character;
        detailedInfo.innerHTML = `
            <p id="name">${character.name}</p>
            <img id="image" src="${character.image}" alt="${character.name}">
            <h4>Total Votes: <span id="vote-count">${character.votes}</span></h4>
        `;
    }

    // Handle vote form submission
    votesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentCharacter) return;

        const votesInput = document.getElementById('votes');
        const voteCount = document.getElementById('vote-count');
        const additionalVotes = parseInt(votesInput.value) || 0;

        // Update votes (no persistence needed)
        currentCharacter.votes += additionalVotes;
        voteCount.textContent = currentCharacter.votes;
        
        // Reset form
        votesForm.reset();
    });
});