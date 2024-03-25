setupFlagClickHandler();

let correctCount = 0;
let incorrectCount = 0;

document.getElementById('guessForm').onsubmit = function(event) {
        event.preventDefault(); // Запобігти стандартному відправленню форми

        var username = document.querySelector('.header span').textContent;

        var userGuess = document.getElementById('userGuess').value;
        var countryName = document.getElementById('countryName').value;

        // AJAX запит на перевірку відповіді
        fetch('/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&countryName=${countryName}&userGuess=${encodeURIComponent(userGuess)}`
        })
        .then(response => response.json()) // Перетворити відповідь у JSON
        .then(data => {
            var feedback = document.getElementById('feedback');
            feedback.textContent = `${countryName}`;
            feedback.className = data.isCorrect ? 'correct' : 'incorrect'; // Змінити клас для встановлення кольору
            feedback.style.display = 'block'; // Показати фідбек

    if (data.isCorrect) {
        correctCount++;
        document.getElementById('correctCount').textContent = `${correctCount}`;
    } else {
        incorrectCount++;
        document.getElementById('incorrectCount').textContent = `${incorrectCount}`;
    }


            // Сховати фідбек і показати новий флаг через секунду
            setTimeout(function() {
                feedback.style.display = 'none'; // Сховати фідбек
                document.getElementById('userGuess').value = ''; // Очистити поле вводу
                // Оновити флаг
                fetch('/flag')
                    .then(response => response.json())
                    .then(newFlagData => {
                        document.getElementById('flagImage').src = newFlagData.imageUrl;
                        document.getElementById('countryName').value = newFlagData.countryName;
                        document.getElementById('flagImage').title = newFlagData.countryName;
                });
            }, 2000); // Затримка 2 секунди
        })
        .catch(error => console.error('Error:', error));
    };

    function setupFlagClickHandler() {
        var flagContainer = document.getElementById('flagContainer');
        var feedbackElement = document.getElementById('feedback');

        flagContainer.addEventListener('click', function() {
            var countryName = document.getElementById('countryName').value;

            feedbackElement.textContent = countryName;
            feedbackElement.className = 'incorrect';
            feedback.style.display = 'block';
        });
    }