document.addEventListener('DOMContentLoaded', () => {
    const characterBar = document.getElementById('character-bar');
    const detailedInfo = document.getElementById('detailed-info');
    const votesForm = document.getElementById('votes-form');
    const resetBtn = document.getElementById('reset-btn');
    const characterForm = document.getElementById('character-form');
    let currentCharacter = null;

    
    fetch('http://localhost:3000/characters')
        .then(response => response.json())
        .then(characters => {
            characters.forEach(character => {
                addCharacterToBar(character);
            });
        });

    
    function addCharacterToBar(character) {
        const span = document.createElement('span');
        span.textContent = character.name;
        span.addEventListener('click', () => displayCharacterDetails(character));
        characterBar.appendChild(span);
    }


    function displayCharacterDetails(character) {
        currentCharacter = character;
        detailedInfo.innerHTML = `
            <p id="name">${character.name}</p>
            <img id="image" src="${character.image}" alt="${character.name}">
            <h4>Total Votes: <span id="vote-count">${character.votes}</span></h4>
            <form id="votes-form">
                <input type="text" placeholder="Enter Votes" id="votes" name="votes">
                <input type="submit" value="Add Votes">
            </form>
            <button id="reset-btn">Reset Votes</button>
        `;
        
        attachFormListeners();
    }

    
    function attachFormListeners() {
        const newVotesForm = document.getElementById('votes-form');
        const newResetBtn = document.getElementById('reset-btn');
        
        newVotesForm.addEventListener('submit', handleVoteSubmit);
        newResetBtn.addEventListener('click', handleResetVotes);
    }
    function handleVoteSubmit(e) {
        e.preventDefault();
        if (!currentCharacter) return;

        const votesInput = document.getElementById('votes');
        const voteCount = document.getElementById('vote-count');
        
        const newVotes = parseInt(votesInput.value);
        if (!isNaN(newVotes)) {
            currentCharacter.votes += newVotes;
            voteCount.textContent = currentCharacter.votes;
            
           
            fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ votes: currentCharacter.votes })
            });
        }
        
        votesInput.value = '';
    }

    
    function handleResetVotes() {
        if (!currentCharacter) return;
        
        currentCharacter.votes = 0;
        const voteCount = document.getElementById('vote-count');
        voteCount.textContent = '0';
        
        
        fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ votes: 0 })
        });
    }

    
    characterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newCharacter = {
            name: document.getElementById('name').value,
            image: document.getElementById('image-url').value,
            votes: 0
        };

        
        fetch('http://localhost:3000/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCharacter)
        })
        .then(response => response.json())
        .then(savedCharacter => {
           
            addCharacterToBar(savedCharacter);
            displayCharacterDetails(savedCharacter);
        });
        
        characterForm.reset();
    });
});