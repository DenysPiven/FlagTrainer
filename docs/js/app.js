// Initialize app
let flags = [];
let userStats = {};
let currentFlag = null;
let correctCount = 0;
let incorrectCount = 0;

// Check if user is logged in
const userId = sessionStorage.getItem('userId');
if (!userId) {
    window.location.href = 'login.html';
}

// Load flags and user stats
async function init() {
    try {
        // Load flags from JSON
        const response = await fetch('data/flags.json');
        flags = await response.json();
        
        // Initialize flags with default values
        flags = flags.map(flag => ({
            ...flag,
            shown: 0,
            correct: 0,
            incorrect: 0,
            weight: 1000.0
        }));
        
        // Load user stats from localStorage
        const savedStats = localStorage.getItem(`userStats_${userId}`);
        if (savedStats) {
            userStats = JSON.parse(savedStats);
            // Merge saved stats with flags
            flags.forEach(flag => {
                if (userStats[flag.flagId]) {
                    Object.assign(flag, userStats[flag.flagId]);
                    calculateWeight(flag);
                }
            });
            
            // Calculate total counts
            correctCount = Object.values(userStats).reduce((sum, stat) => sum + (stat.correct || 0), 0);
            incorrectCount = Object.values(userStats).reduce((sum, stat) => sum + (stat.incorrect || 0), 0);
        }
        
        // Display user ID and counts
        document.getElementById('userIdDisplay').textContent = userId;
        document.getElementById('correctCount').textContent = correctCount;
        document.getElementById('incorrectCount').textContent = incorrectCount;
        
        // Show first flag
        showRandomFlag();
        
        // Setup event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

function calculateWeight(flag) {
    flag.weight = 1.0 / (1 + Math.exp(flag.correct - flag.incorrect));
}

function getRandomFlag() {
    // Count how many flags have been shown
    const shownCount = flags.filter(flag => flag.shown > 0).length;
    
    // If not all flags have been shown yet, only show unshown flags
    let availableFlags;
    if (shownCount < flags.length) {
        availableFlags = flags.filter(flag => flag.shown === 0);
    } else {
        availableFlags = flags;
    }
    
    // Calculate total weight
    const totalWeight = availableFlags.reduce((sum, flag) => sum + flag.weight, 0);
    
    if (totalWeight === 0) {
        // Fallback if all weights are 0
        return availableFlags[Math.floor(Math.random() * availableFlags.length)];
    }
    
    // Select random flag based on weight
    let randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0.0;
    
    for (const flag of availableFlags) {
        cumulativeWeight += flag.weight;
        if (randomValue <= cumulativeWeight) {
            return flag;
        }
    }
    
    // Fallback to first flag
    return availableFlags[0];
}

function showRandomFlag() {
    currentFlag = getRandomFlag();
    
    // Update text content immediately
    document.getElementById('flagId').textContent = currentFlag.flagId;
    document.getElementById('flagCapital').textContent = currentFlag.capital;
    document.getElementById('flagContinent').textContent = currentFlag.continent;
    
    // Hide flag info
    document.getElementById('flagId').style.display = 'none';
    document.getElementById('flagCapital').style.display = 'none';
    document.getElementById('flagContinent').style.display = 'none';
    
    // Disable buttons
    document.getElementById('correctBtn').classList.add('disabled');
    document.getElementById('incorrectBtn').classList.add('disabled');
    
    // Set image source directly (browser will cache it)
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
    
    // Update flag stats
    currentFlag.shown++;
    if (isCorrect) {
        currentFlag.correct++;
        correctCount++;
    } else {
        currentFlag.incorrect++;
        incorrectCount++;
    }
    calculateWeight(currentFlag);
    
    // Save to userStats
    userStats[currentFlag.flagId] = {
        shown: currentFlag.shown,
        correct: currentFlag.correct,
        incorrect: currentFlag.incorrect,
        weight: currentFlag.weight
    };
    
    // Save to localStorage
    localStorage.setItem(`userStats_${userId}`, JSON.stringify(userStats));
    
    // Hide flag info
    document.getElementById('flagId').style.display = 'none';
    document.getElementById('flagCapital').style.display = 'none';
    document.getElementById('flagContinent').style.display = 'none';
    
    // Update counts
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('incorrectCount').textContent = incorrectCount;
    
    // Disable buttons
    document.getElementById('correctBtn').classList.add('disabled');
    document.getElementById('incorrectBtn').classList.add('disabled');
    
    // Show next flag immediately (image preloading will handle smooth transition)
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

// Initialize on page load
init();
setupFlagClickHandler();
