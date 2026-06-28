const userId = Profiles.getCurrent();
if (!userId) {
    window.location.href = Paths.route('login');
}

function updateLangButtons() {
    document.querySelectorAll('.lang-option').forEach((button) => {
        button.classList.toggle('active', button.getAttribute('data-lang') === I18n.getLang());
    });
}

function setupLanguageOptions() {
    document.querySelectorAll('.lang-option').forEach((button) => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (lang && lang !== I18n.getLang()) {
                I18n.setLang(lang).then(updateLangButtons);
            }
        });
    });
}

function renderProfileLabel() {
    const label = document.getElementById('settingsProfile');
    if (label) {
        label.textContent = I18n.t('settingsProfile', { name: userId });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    I18n.init().then(function() {
        I18n.applyPage();
        renderProfileLabel();
        updateLangButtons();
        setupLanguageOptions();
    });

    document.addEventListener('languagechange', function() {
        I18n.applyPage();
        renderProfileLabel();
        updateLangButtons();
    });
});
