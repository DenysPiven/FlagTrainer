setupFlagClickHandler();

let correctCount = 0;
let incorrectCount = 0;

document.getElementById('correctBtn').addEventListener('click', function(event) {
    handleAnswer(true);
});

document.getElementById('incorrectBtn').addEventListener('click', function(event) {
    handleAnswer(false);
});

function handleAnswer(isCorrect) {
    if(document.getElementById('correctBtn').classList.contains("disabled")){
        return;
    }

    const flagIdElement = document.getElementById('flagId');
    const flagCapital = document.getElementById('flagCapital');
    const flagContinent = document.getElementById('flagContinent');
    const flagId = flagIdElement.textContent;

    const userId = document.querySelector('.header span').textContent;

    fetch('/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&flagId=${flagId}&isCorrect=${isCorrect}`
    })
    .then(response => response.json())
    .then(data => {

        flagIdElement.style.display = 'none';
        flagCapital.style.display = 'none';
        flagContinent.style.display = 'none';

        const countElementId = data.isCorrect ? 'correctCount' : 'incorrectCount';
        const count = data.isCorrect ? ++correctCount : ++incorrectCount;
        document.getElementById(countElementId).textContent = `${count}`;

        fetch('/flag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `userId=${userId}`
        })
            .then(response => response.json())
            .then(newFlagData => {
                document.getElementById('flagImage').src = newFlagData.imageUrl;
                document.getElementById('flagId').textContent = newFlagData.flagId;
                document.getElementById('flagCapital').textContent = newFlagData.capital;
                document.getElementById('flagContinent').textContent = newFlagData.continent;
            });

        document.getElementById('correctBtn').classList.add("disabled");
        document.getElementById('incorrectBtn').classList.add("disabled");
    })
    .catch(error => console.error('Error:', error));
}

function setupFlagClickHandler() {

    const containerMain = document.getElementById('containerMain');
    const flagId = document.getElementById('flagId');
    const flagCapital = document.getElementById('flagCapital');
    const flagContinent = document.getElementById('flagContinent');

    const correctBtn = document.getElementById('correctBtn').classList;
    const incorrectBtn = document.getElementById('incorrectBtn').classList;

    containerMain.addEventListener('click', function(e) {
        e.preventDefault();

        flagId.style.display = 'block';
        flagCapital.style.display = 'block';
        flagContinent.style.display = 'block';

        if(correctBtn.contains("disabled")){
            correctBtn.remove("disabled");
            incorrectBtn.remove("disabled");
        }
    });
}