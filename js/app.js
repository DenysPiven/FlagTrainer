const userId = sessionStorage.getItem('userId');
if (!userId) {
    window.location.href = 'login.html';
}

let flags = [];
let userStats = {};
let currentFlag = null;
let correctCount = 0;
let incorrectCount = 0;

function updateFlagDisplay() {
    if (!currentFlag) {
        return;
    }

    const country = I18n.getCountry(currentFlag);
    document.getElementById('flagId').textContent = country.name;
    document.getElementById('flagCapital').textContent = country.capital;
    document.getElementById('flagContinent').textContent = country.continent;
    document.getElementById('flagImage').alt = I18n.t('flagAlt');
}

async function init() {
    try {
        await I18n.init();

        const response = await fetch('../data/flags.json');
        flags = await response.json();

        flags = flags.map(flag => ({
            ...flag,
            shown: 0,
            correct: 0,
            incorrect: 0,
            weight: 1000.0
        }));

        const savedStats = localStorage.getItem(`userStats_${userId}`);
        if (savedStats) {
            userStats = JSON.parse(savedStats);
            flags.forEach(flag => {
                if (userStats[flag.flagId]) {
                    Object.assign(flag, userStats[flag.flagId]);
                    calculateWeight(flag);
                }
            });

            correctCount = Object.values(userStats).reduce((sum, stat) => sum + (stat.correct || 0), 0);
            incorrectCount = Object.values(userStats).reduce((sum, stat) => sum + (stat.incorrect || 0), 0);
        }

        document.getElementById('userIdDisplay').textContent = userId;
        document.getElementById('correctCount').textContent = correctCount;
        document.getElementById('incorrectCount').textContent = incorrectCount;

        showRandomFlag();
        setupEventListeners();

        document.addEventListener('languagechange', updateFlagDisplay);
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

function calculateWeight(flag) {
    flag.weight = 1.0 / (1 + Math.exp(flag.correct - flag.incorrect));
}

function getRandomFlag() {
    const shownCount = flags.filter(flag => flag.shown > 0).length;

    let availableFlags;
    if (shownCount < flags.length) {
        availableFlags = flags.filter(flag => flag.shown === 0);
    } else {
        availableFlags = flags;
    }

    const totalWeight = availableFlags.reduce((sum, flag) => sum + flag.weight, 0);

    if (totalWeight === 0) {
        return availableFlags[Math.floor(Math.random() * availableFlags.length)];
    }

    let randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0.0;

    for (const flag of availableFlags) {
        cumulativeWeight += flag.weight;
        if (randomValue <= cumulativeWeight) {
            return flag;
        }
    }

    return availableFlags[0];
}

function showRandomFlag() {
    currentFlag = getRandomFlag();

    updateFlagDisplay();

    document.getElementById('flagId').style.display = 'none';
    document.getElementById('flagCapital').style.display = 'none';
    document.getElementById('flagContinent').style.display = 'none';

    document.getElementById('correctBtn').classList.add('disabled');
    document.getElementById('incorrectBtn').classList.add('disabled');

    document.getElementById('flagImage').src = currentFlag.imageUrl;
}

function setupEventListeners() {
    document.getElementById('correctBtn').addEventListener('click', function() {
        handleAnswer(true);
    });

    document.getElementById('incorrectBtn').addEventListener('click', function() {
        handleAnswer(false);
    });
}

function handleAnswer(isCorrect) {
    if (document.getElementById('correctBtn').classList.contains('disabled')) {
        return;
    }

    if (!currentFlag) {
        return;
    }

    currentFlag.shown++;
    if (isCorrect) {
        currentFlag.correct++;
        correctCount++;
    } else {
        currentFlag.incorrect++;
        incorrectCount++;
    }
    calculateWeight(currentFlag);

    userStats[currentFlag.flagId] = {
        shown: currentFlag.shown,
        correct: currentFlag.correct,
        incorrect: currentFlag.incorrect,
        weight: currentFlag.weight
    };

    localStorage.setItem(`userStats_${userId}`, JSON.stringify(userStats));

    document.getElementById('flagId').style.display = 'none';
    document.getElementById('flagCapital').style.display = 'none';
    document.getElementById('flagContinent').style.display = 'none';

    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('incorrectCount').textContent = incorrectCount;

    document.getElementById('correctBtn').classList.add('disabled');
    document.getElementById('incorrectBtn').classList.add('disabled');

    showRandomFlag();
}

function setupFlagClickHandler() {
    const flagContainer = document.getElementById('flagContainer');
    const flagId = document.getElementById('flagId');
    const flagCapital = document.getElementById('flagCapital');
    const flagContinent = document.getElementById('flagContinent');
    const correctBtn = document.getElementById('correctBtn');
    const incorrectBtn = document.getElementById('incorrectBtn');

    flagContainer.addEventListener('click', function(e) {
        e.preventDefault();

        flagId.style.display = 'block';
        flagCapital.style.display = 'block';
        flagContinent.style.display = 'block';

        if (correctBtn.classList.contains('disabled')) {
            correctBtn.classList.remove('disabled');
            incorrectBtn.classList.remove('disabled');
        }
    });
}

init();
setupFlagClickHandler();
