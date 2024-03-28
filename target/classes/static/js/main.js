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

    var countryNameElement = document.getElementById('countryName');
    var countryName = countryNameElement.textContent;

    var username = document.querySelector('.header span').textContent;

    fetch('/' + encodeURIComponent(username) + '/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `countryName=${countryName}&isCorrect=${isCorrect}`
    })
    .then(response => response.json())
    .then(data => {

        countryNameElement.style.display = 'none';

        const countElementId = data.isCorrect ? 'correctCount' : 'incorrectCount';
        const count = data.isCorrect ? ++correctCount : ++incorrectCount;
        document.getElementById(countElementId).textContent = `${count}`;

        fetch('/' + encodeURIComponent(username) + '/flag')
            .then(response => response.json())
            .then(newFlagData => {
                document.getElementById('flagImage').src = newFlagData.imageUrl;
                document.getElementById('flagImage').title = newFlagData.countryName;
                document.getElementById('countryName').textContent = newFlagData.countryName;
            });

        document.getElementById('correctBtn').classList.add("disabled");
        document.getElementById('incorrectBtn').classList.add("disabled");
    })
    .catch(error => console.error('Error:', error));
}

function setupFlagClickHandler() {
    checkUserStatus();

    var containerMain = document.getElementById('containerMain');
    var countryName = document.getElementById('countryName');

    var correctBtn = document.getElementById('correctBtn').classList;
    var incorrectBtn = document.getElementById('incorrectBtn').classList;

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
