function showError(message) {
    const error = document.getElementById('login-error');
    error.textContent = message;
    error.classList.remove('hidden');
}

function clearError() {
    const error = document.getElementById('login-error');
    error.textContent = '';
    error.classList.add('hidden');
}

function enterProfile(name) {
    Profiles.setCurrent(name);
    window.location.href = Paths.route('training');
}

function renderProfilesList() {
    const section = document.getElementById('profiles-section');
    const list = document.getElementById('profiles-list');
    const profiles = Profiles.getAll();

    if (profiles.length === 0) {
        section.classList.add('hidden');
        list.innerHTML = '';
        return;
    }

    section.classList.remove('hidden');
    list.innerHTML = profiles.map((name) => {
        const stats = Profiles.getStatsSummary(name);
        const statsText = I18n.t('profileStats', {
            correct: stats.correct,
            incorrect: stats.incorrect
        });

        return `
            <li class="profile-item">
                <button type="button" class="profile-select-btn" data-profile="${name}">
                    <span class="profile-name">${name}</span>
                    <span class="profile-stats">${statsText}</span>
                </button>
                <button type="button" class="profile-delete-btn" data-profile="${name}" aria-label="${I18n.t('deleteProfile', { name })}">×</button>
            </li>
        `;
    }).join('');

    list.querySelectorAll('.profile-select-btn').forEach((button) => {
        button.addEventListener('click', function() {
            enterProfile(this.getAttribute('data-profile'));
        });
    });

    list.querySelectorAll('.profile-delete-btn').forEach((button) => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const name = this.getAttribute('data-profile');

            if (confirm(I18n.t('deleteProfileConfirm', { name }))) {
                Profiles.remove(name);
                renderPage();
            }
        });
    });
}

function renderPage() {
    renderProfilesList();
}

function validateName(name) {
    if (!Profiles.isValidName(name)) {
        showError(I18n.t('loginHint'));
        return false;
    }

    if (Profiles.exists(name)) {
        enterProfile(name);
        return false;
    }

    clearError();
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentProfile = Profiles.getCurrent();
    if (currentProfile) {
        window.location.href = Paths.route('training');
        return;
    }

    I18n.init({ guest: true }).then(function() {
        I18n.applyPage();
        renderPage();
    });

    document.getElementById('userId').addEventListener('input', clearError);

    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const userId = document.getElementById('userId').value.trim();

        if (!validateName(userId)) {
            return;
        }

        Profiles.add(userId);
        enterProfile(userId);
    });
});
