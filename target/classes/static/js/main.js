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

    var flagIdElement = document.getElementById('flagId');
    var flagId = flagIdElement.textContent;

    var userId = document.querySelector('.header span').textContent;

    fetch('/' + encodeURIComponent(userId) + '/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `flagId=${flagId}&isCorrect=${isCorrect}`
    })
    .then(response => response.json())
    .then(data => {

        flagIdElement.style.display = 'none';

        const countElementId = data.isCorrect ? 'correctCount' : 'incorrectCount';
        const count = data.isCorrect ? ++correctCount : ++incorrectCount;
        document.getElementById(countElementId).textContent = `${count}`;

        fetch('/' + encodeURIComponent(userId) + '/flag')
            .then(response => response.json())
            .then(newFlagData => {
                document.getElementById('flagImage').src = newFlagData.imageUrl;
                document.getElementById('flagImage').title = newFlagData.flagId;
                document.getElementById('flagId').textContent = newFlagData.flagId;
            });

        document.getElementById('correctBtn').classList.add("disabled");
        document.getElementById('incorrectBtn').classList.add("disabled");
    })
    .catch(error => console.error('Error:', error));
}

function setupFlagClickHandler() {
    checkUserStatus();

    var containerMain = document.getElementById('containerMain');
    var flagId = document.getElementById('flagId');

    var correctBtn = document.getElementById('correctBtn').classList;
    var incorrectBtn = document.getElementById('incorrectBtn').classList;

    containerMain.addEventListener('click', function(e) {
        e.preventDefault();

        flagId.style.display = 'block';

        if(correctBtn.contains("disabled")){
            correctBtn.remove("disabled");
            incorrectBtn.remove("disabled");
        }
    });
}

function checkUserStatus() {
    if (document.getElementById('userIdDisplay').textContent.trim() === 'Guest') {
        window.location.href = '/login';
    }
}

window.addEventListener('beforeunload', function(event) {
    navigator.sendBeacon('/save');
});


