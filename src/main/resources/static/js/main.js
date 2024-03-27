setupFlagClickHandler();

checkUserStatus();

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

                document.getElementById('incorrectBtn').classList.add("disabled");
                document.getElementById('correctBtn').classList.add("disabled");
    })
    .catch(error => console.error('Error:', error));
}

function setupFlagClickHandler() {
    checkUserStatus();

    var containerMain = document.getElementById('containerMain');
    var countryName = document.getElementById('countryName');

    var incorrectBtn = document.getElementById('incorrectBtn').classList;
    var correctBtn = document.getElementById('correctBtn').classList;

    containerMain.addEventListener('click', function(e) {
        e.preventDefault();

        countryName.style.display = 'block';

        if(correctBtn.contains("disabled")){
            correctBtn.remove("disabled");
            incorrectBtn.remove("disabled");
        }
    });
}

function checkUserStatus() {
    if (document.getElementById('usernameDisplay').textContent.trim() === 'Guest') {
        window.location.href = '/login';
    }
}
