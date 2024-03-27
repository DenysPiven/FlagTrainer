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
    var username = document.querySelector('.header span').textContent;
    var countryName = document.getElementById('countryName').textContent;

    fetch('/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&countryName=${countryName}&isCorrect=${isCorrect}`
    })
    .then(response => response.json()) // Перетворити відповідь у JSON
    .then(data => {
        var countryName = document.getElementById('countryName');
        countryName.style.display = 'none'; // Показати фідбек

        if (data.isCorrect) {
            correctCount++;
            document.getElementById('correctCount').textContent = `${correctCount}`;
        } else {
            incorrectCount++;
            document.getElementById('incorrectCount').textContent = `${incorrectCount}`;
        }

        // Оновити флаг
        fetch('/flag')
            .then(response => response.json())
            .then(newFlagData => {
                document.getElementById('flagImage').src = newFlagData.imageUrl;
                document.getElementById('countryName').textContent = newFlagData.countryName;
                document.getElementById('flagImage').title = newFlagData.countryName;
            });
    })
    .catch(error => console.error('Error:', error));
}

function setupFlagClickHandler() {
    var flagContainer = document.getElementById('flagContainer');
    var countryName = document.getElementById('countryName');

    flagContainer.addEventListener('click', function() {
        countryName.style.display = 'block';
    });
}
