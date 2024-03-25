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
                        document.getElementById('timesGuessedCorrectly').textContent = newFlagData.timesGuessedCorrectly;
                        document.getElementById('timesGuessedIncorrectly').textContent = newFlagData.timesGuessedIncorrectly;
                });
            }, 2000); // Затримка 2 секунди
        })
        .catch(error => console.error('Error:', error));
    };